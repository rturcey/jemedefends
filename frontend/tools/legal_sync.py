#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
legal_sync.py - Synchronisation unifiée des références légales
Architecture centralisée, TOC → LEGIARTI → getArticle avec fallbacks

Chaîne robuste:
  1) TOC (/consult/legi/tableMatieres) pour mapper NUM → (liste de) LEGIARTI
  2) Fallback /consult/getArticleWithIdAndNum (LEGITEXT + num variants)
  3) Fallback /search (NUM_ARTICLE + NOM_CODE + ID_CODE, typePagination=ARTICLE) → getArticle
  + Validation stricte que le numéro résolu == numéro demandé (sinon on continue les fallbacks)

Version: 2.3
"""

import argparse
import json
import os
import re
import sys
import time
import hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict

import requests
from requests.adapters import HTTPAdapter, Retry
from dotenv import load_dotenv

load_dotenv()

# ---------- Configuration chemins ----------
PROJECT_ROOT = Path(__file__).resolve().parents[2]  # <repo>/...
FRONTEND_ROOT = PROJECT_ROOT / "frontend"
LEGAL_DIR = FRONTEND_ROOT / "src" / "legal"
REGISTRY_FILE = LEGAL_DIR / "registry.generated.json"
REGISTRY_TS_FILE = LEGAL_DIR / "registry.ts"

# ---------- Logging ----------
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

def log_info(msg: str):    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")
def log_success(msg: str): print(f"{Colors.GREEN}{msg}{Colors.END}")
def log_warning(msg: str): print(f"{Colors.YELLOW} {msg}{Colors.END}")
def log_error(msg: str):   print(f"{Colors.RED}❌ {msg}{Colors.END}")
def log_change(msg: str):  print(f"{Colors.BOLD}{Colors.YELLOW}🔄 {msg}{Colors.END}")

# ---------- Modèles ----------
@dataclass
class ArticleDefinition:
    code: str
    id: str           # ex: "L.217-3" ou "1641"
    label: str
    source: str = "LEGIFRANCE"
    priority: int = 5
    text: Optional[str] = None
    lastVerified: Optional[str] = None
    lastModified: Optional[str] = None
    status: str = "UNKNOWN"
    url: Optional[str] = None
    wordCount: int = 0
    checksum: Optional[str] = None
    isValid: bool = False

@dataclass
class RegistryMetadata:
    lastUpdated: str
    version: str
    totalArticles: int
    validArticles: int
    coverage: float
    checksum: str

@dataclass
class LegalRegistry:
    articles: Dict[str, ArticleDefinition]
    metadata: RegistryMetadata

# ---------- Utils ----------
def _now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")

def _norm_num(s: str) -> str:
    """Normalise un numéro d'article : 'L.217-3' → forme canonique 'L.217-3'."""
    if not s:
        return ""
    t = s.strip().upper()
    t = t.replace("—", "-").replace("–", "-")
    t = re.sub(r"\s+", " ", t)
    t = t.replace(". ", ".")
    t = t.replace(" ", "")
    if re.match(r"^[A-Z]\d", t):
        t = t[0] + "." + t[1:]
    t = re.sub(r"^([A-Z])(?=\d)", r"\1.", t)
    return t

def _num_variants(num: str) -> List[str]:
    """Génère quelques variantes acceptées par certains endpoints."""
    n = _norm_num(num)                   # L.217-3
    raw = n.replace(".", "")             # L217-3
    spaced = re.sub(r"\.", " ", n, 1)    # L 217-3
    return list(dict.fromkeys([n, raw, spaced]))

def _is_vigueur(etat: Optional[str]) -> bool:
    return bool(etat and "VIGUEUR" in etat.upper())

def _checksum(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:8]

# ---------- Parser TS ----------
class TypeScriptParser:
    """Extrait les defs d'articles depuis frontend/src/legal/registry.ts"""
    def __init__(self, registry_file: Path):
        self.registry_file = registry_file

    def extract_article_definitions(self) -> Dict[str, ArticleDefinition]:
        if not self.registry_file.exists():
            log_error(f"Fichier TS non trouvé: {self.registry_file}")
            return {}
        content = self.registry_file.read_text(encoding="utf-8")

        # Pattern simple : 'L.217-3': { code: 'CODE_CONSOMMATION', id: 'L.217-3', label: '...' , priority: 5 }
        pattern = r"'([^']+)':\s*{\s*code:\s*'([^']+)',\s*id:\s*'([^']+)',\s*label:\s*'([^']+)'[^}]*?priority:\s*(\d+)"
        matches = re.findall(pattern, content, re.DOTALL | re.MULTILINE)

        out: Dict[str, ArticleDefinition] = {}
        for art_id, code, id_confirm, label, priority in matches:
            if art_id != id_confirm:
                log_warning(f"Incohérence id TS: {art_id} vs {id_confirm}")
                continue
            canon = _norm_num(art_id)
            out[canon] = ArticleDefinition(
                code=code,
                id=canon,
                label=label,
                priority=int(priority)
            )
        log_info(f"Definitions extraites depuis TS: {len(out)}")
        return out

# ---------- Client PISTE ----------
class LegifranceClient:
    AUTH = {
        "prod": "https://oauth.piste.gouv.fr/api/oauth/token",
        "sandbox": "https://sandbox-oauth.piste.gouv.fr/api/oauth/token",
    }
    BASE = {
        "prod": "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
        "sandbox": "https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app",
    }
    CODE_TO_LEGITEXT = {
        "CODE_CONSOMMATION": "LEGITEXT000006069565",
        "CODE_CIVIL": "LEGITEXT000006070721",
        "CODE_PROCEDURE_CIVILE": "LEGITEXT000006070716",
    }
    CODE_NAME = {
        "CODE_CONSOMMATION": "Code de la consommation",
        "CODE_CIVIL": "Code civil",
        "CODE_PROCEDURE_CIVILE": "Code de procédure civile",
    }

    def __init__(self, client_id: Optional[str], client_secret: Optional[str], env: str = "prod", verbose: bool = False):
        self.client_id = client_id
        self.client_secret = client_secret
        self.env = env if env in ("prod", "sandbox") else "prod"
        self.verbose = verbose

        self.auth_url = self.AUTH[self.env]
        self.base_url = self.BASE[self.env]

        self.access_token: Optional[str] = None
        self.token_expiry: Optional[datetime] = None

        # Session JSON pour les appels API (hors OAuth)
        self.session = requests.Session()
        retry_strategy = Retry(total=4, backoff_factor=0.6, status_forcelist=(429, 500, 502, 503, 504))
        self.session.mount("https://", HTTPAdapter(max_retries=retry_strategy))
        self.session.headers.update({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "fr",
            "User-Agent": "jemedefends-legal-sync/2.3",
        })
        if client_id:
            self.session.headers.setdefault("X-Client-Id", client_id)

        if self.client_id and self.client_secret:
            self._authenticate()
        else:
            log_warning("Clés PISTE absentes → mode dégradé (aucun fetch possible).")

        # caches
        self._toc_cache: Dict[str, Dict[str, Any]] = {}
        # num -> liste de candidats (dicts avec id/num/raw)
        self._num_to_arti_cache: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}

    def _authenticate(self) -> None:
        if self.verbose:
            log_info(f"Auth PISTE ({self.env})…")
        data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "scope": "openid",
        }
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "jemedefends-legal-sync/2.3",
        }
        r = requests.post(self.auth_url, data=data, headers=headers, timeout=30)
        if r.status_code != 200:
            raise RuntimeError(f"OAuth {r.status_code}: {r.text[:200]}")
        js = r.json() or {}
        token = js.get("access_token")
        if not token:
            raise RuntimeError("OAuth: pas d'access_token")
        self.access_token = token
        self.token_expiry = datetime.now(timezone.utc) + timedelta(seconds=int(js.get("expires_in", 3600)) - 120)
        self.session.headers["Authorization"] = f"Bearer {token}"
        if self.verbose:
            log_success("Auth OK")

    def _refresh_token_if_needed(self):
        if not self.access_token or not self.token_expiry:
            return
        if datetime.now(timezone.utc) >= self.token_expiry:
            if self.verbose:
                log_info("Refresh token…")
            self._authenticate()

    # ---- API calls
    def consult_table_matieres(self, legitext: str) -> Dict[str, Any]:
        self._refresh_token_if_needed()
        url = f"{self.base_url}/consult/legi/tableMatieres"
        body = {"nature": "CODE", "textCid": legitext}
        r = self.session.post(url, json=body, timeout=40)
        if r.status_code != 200:
            raise RuntimeError(f"TOC {legitext} {r.status_code}: {r.text[:300]}")
        return r.json() or {}

    def consult_get_article(self, legiarti: str) -> Dict[str, Any]:
        self._refresh_token_if_needed()
        url = f"{self.base_url}/consult/getArticle"
        r = self.session.post(url, json={"id": legiarti}, timeout=40)
        if r.status_code != 200:
            raise RuntimeError(f"getArticle {legiarti} {r.status_code}: {r.text[:300]}")
        return r.json() or {}

    def consult_get_article_with_id_and_num(self, legitext: str, num: str) -> Optional[Dict[str, Any]]:
        """Fallback #1 : /consult/getArticleWithIdAndNum (id code + numéro d'article)."""
        self._refresh_token_if_needed()
        url = f"{self.base_url}/consult/getArticleWithIdAndNum"
        for candidate in _num_variants(num):
            payload = {"id": legitext, "num": candidate}
            r = self.session.post(url, json=payload, timeout=40)
            if r.status_code == 200:
                try:
                    js = r.json() or {}
                except Exception:
                    js = {}
                art = js.get("article") or js
                if isinstance(art, dict) and (art.get("id") or art.get("cid") or "texteHtml" in art):
                    return js
            else:
                if self.verbose:
                    log_warning(f"getArticleWithIdAndNum {candidate} → {r.status_code}: {r.text[:200]}")
        return None

    def search_legiarti_by_num(self, code: str, num: str, at_ms: Optional[int] = None) -> Optional[str]:
        """
        Fallback #2 : /search structuré pour résoudre LEGIARTI quand TOC et getArticleWithIdAndNum ont échoué.
        On contraint par NOM_CODE + ID_CODE (LEGITEXT) et, si possible, par DATE_VERSION (today).
        """
        self._refresh_token_if_needed()

        legitext = self.CODE_TO_LEGITEXT.get(code)
        fond = "CODE_DATE" if at_ms else "CODE_ETAT"

        filtres = [{"facette": "NOM_CODE", "valeurs": [self.CODE_NAME.get(code, code)]}]
        if legitext:
            # Certaines instances exposent ID_CODE ; si ignorée, l'API l'ignore silencieusement.
            filtres.append({"facette": "ID_CODE", "valeurs": [legitext]})
        if at_ms:
            filtres.append({"facette": "DATE_VERSION", "singleDate": at_ms})

        payload = {
            "recherche": {
                "champs": [
                    {
                        "typeChamp": "NUM_ARTICLE",
                        "criteres": [
                            {"typeRecherche": "EXACTE", "valeur": _norm_num(num), "operateur": "ET"}
                        ],
                        "operateur": "ET"
                    }
                ],
                "filtres": filtres,
                "pageNumber": 1,
                "pageSize": 10,
                "operateur": "ET",
                "sort": "PERTINENCE",
                "typePagination": "ARTICLE"
            },
            "fond": fond
        }

        url = f"{self.base_url}/search"
        r = self.session.post(url, json=payload, timeout=40)
        if r.status_code != 200:
            if self.verbose:
                log_warning(f"/search fallback {code} {num} → {r.status_code}: {r.text[:200]}")
            return None

        try:
            data = r.json() or {}
        except Exception:
            if self.verbose:
                log_warning("/search: réponse non-JSON")
            return None

        results = data.get("results") or data.get("searchResults") or []
        if not results:
            return None

        for res in results:
            legiarti = res.get("id") or res.get("cid") or res.get("articleId")
            if isinstance(legiarti, str) and legiarti.startswith("LEGIARTI"):
                return legiarti
        return None

    # ---- Helpers NUM → LEGIARTI via TOC
    def _walk_collect_articles(self, node: Any, out: List[Dict[str, Any]]):
        if isinstance(node, dict):
            arti_id = None
            for k in ("id", "cid", "articleId"):
                v = node.get(k)
                if isinstance(v, str) and v.startswith("LEGIARTI"):
                    arti_id = v
                    break
            if arti_id:
                num = None
                for k in ("num", "numero"):
                    vv = node.get(k)
                    if isinstance(vv, str) and vv.strip():
                        num = vv
                        break
                if not num:
                    vv = node.get("computedNums")
                    if isinstance(vv, list) and vv:
                        num = str(vv[0])
                if not num:
                    for k in ("titre", "title", "libelle"):
                        tt = node.get(k)
                        if isinstance(tt, str) and "ARTICLE" in tt.upper():
                            m = re.search(r"[A-Z]?\s*\.?\s*\d+(?:-\d+)?(?:-\d+)?", tt.upper())
                            if m:
                                num = m.group(0)
                                break
                out.append({"id": arti_id, "num": _norm_num(num or ""), "raw": node})
            for v in node.values():
                self._walk_collect_articles(v, out)
        elif isinstance(node, list):
            for it in node:
                self._walk_collect_articles(it, out)

    def num_to_legiarti(self, code: str) -> Dict[str, List[Dict[str, Any]]]:
        """Construit (et met en cache) le mapping NUM → [candidats] pour un code via TOC."""
        if code in self._num_to_arti_cache:
            return self._num_to_arti_cache[code]
        legitext = self.CODE_TO_LEGITEXT.get(code)
        if not legitext:
            raise ValueError(f"LEGITEXT inconnu pour code {code}")

        if self.verbose:
            log_info(f"TOC {code} ({legitext})…")
        toc = self.consult_table_matieres(legitext)
        coll: List[Dict[str, Any]] = []
        self._walk_collect_articles(toc, coll)

        mapping: Dict[str, List[Dict[str, Any]]] = {}
        for it in coll:
            if it["num"]:
                key = _norm_num(it["num"])
                mapping.setdefault(key, []).append(it)

        self._num_to_arti_cache[code] = mapping
        if self.verbose:
            total = sum(len(v) for v in mapping.values())
            log_info(f"NUM→LEGIARTI {code}: {total} candidats")
        return mapping

    @staticmethod
    def _pick_best_candidate(candidates: List[Dict[str, Any]]) -> Optional[str]:
        if not candidates:
            return None

        def score(it: Dict[str, Any]) -> Tuple[int, str]:
            raw = it.get("raw", {})
            etat = (raw.get("etat") or "").upper()
            vigueur = 1 if "VIGUEUR" in etat else 0
            date = raw.get("dateDebutVersion") or raw.get("dateDebut") or ""
            return (vigueur, str(date))

        best = max(candidates, key=score)
        return best["id"] if best and isinstance(best.get("id"), str) else None

    @staticmethod
    def _extract_num_from_article(article_obj: Dict[str, Any]) -> str:
        for k in ("num", "numero", "numArticle"):
            v = article_obj.get(k)
            if isinstance(v, str) and v.strip():
                return _norm_num(v)
        for k in ("titre", "title", "libelle"):
            v = article_obj.get(k)
            if isinstance(v, str):
                m = re.search(r"[A-Z]?\s*\.?\s*\d+(?:-\d+)*", v.upper())
                if m:
                    return _norm_num(m.group(0))
        return ""

    # ---- Facade principale
    def get_article_by_num(self, code: str, num: str) -> Optional[ArticleDefinition]:
        """Résout un numéro d'article, puis récupère le contenu avec chaîne de fallbacks."""
        requested_num = _norm_num(num)
        legitext = self.CODE_TO_LEGITEXT.get(code)

        def fetch_and_validate(legiarti: Optional[str], art_obj: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
            """Récupère l'article (via getArticle ou art_obj) et valide le numéro."""
            if not legiarti and not art_obj:
                return None
            payload = {"article": art_obj} if art_obj else self.consult_get_article(legiarti)  # type: ignore
            art = payload.get("article") or payload
            if not isinstance(art, dict):
                return None
            resolved_num = self._extract_num_from_article(art)
            if resolved_num and _norm_num(resolved_num) != requested_num:
                if self.verbose:
                    log_warning(f"Numéro incohérent: demandé={requested_num} résolu={resolved_num} via {legiarti}.")
                return None
            return art

        # 1) TOC → meilleur candidat
        try:
            mapping = self.num_to_legiarti(code)
            cands = mapping.get(requested_num, [])
            legiarti = self._pick_best_candidate(cands) if cands else None
        except Exception as e:
            legiarti = None
            if self.verbose:
                log_warning(f"TOC indisponible ({e}); on passe aux fallbacks.")

        # 1.b) Si TOC a donné quelque chose, on essaie tout de suite
        art = fetch_and_validate(legiarti) if legiarti else None

        # 2) Fallback: getArticleWithIdAndNum
        if not art and legitext:
            try:
                js = self.consult_get_article_with_id_and_num(legitext, requested_num)
            except Exception as e:
                js = None
                if self.verbose:
                    log_warning(f"getArticleWithIdAndNum KO: {e}")
            if js:
                art_obj = js.get("article") or js
                legiarti2 = (art_obj.get("id") or art_obj.get("cid")) if isinstance(art_obj, dict) else None
                art = fetch_and_validate(legiarti2, art_obj if isinstance(art_obj, dict) else None)

        # 3) Fallback: /search (date du jour), puis sans date
        if not art:
            today_ms = int(datetime.now().timestamp() * 1000)
            legiarti3 = self.search_legiarti_by_num(code, requested_num, at_ms=today_ms)
            if legiarti3:
                art = fetch_and_validate(legiarti3)
        if not art:
            legiarti4 = self.search_legiarti_by_num(code, requested_num, at_ms=None)
            if legiarti4:
                art = fetch_and_validate(legiarti4)

        if not art:
            if self.verbose:
                log_warning(f"Article introuvable ou non valide pour {code} {requested_num}")
            return None

        # 4) Construction de l'ArticleDefinition
        try:
            text = self._extract_text(art)
            if not text:
                if self.verbose:
                    log_warning("Texte vide après résolution.")
                return None

            etat = (art.get("etat") or "VIGUEUR").upper()
            legiarti_final = art.get("id") or art.get("cid")  # l'objet retourné contient normalement l'id
            last_mod = art.get("dateDebut") or art.get("dateDebutVersion")

            return ArticleDefinition(
                code=code,
                id=requested_num,
                label=f"{self.CODE_NAME.get(code, code)}, art. {requested_num}",
                text=text,
                lastVerified=datetime.now().strftime("%Y-%m-%d"),
                lastModified=str(last_mod) if last_mod else None,
                status="VIGUEUR" if _is_vigueur(etat) else etat,
                url=f"https://www.legifrance.gouv.fr/codes/article_lc/{legiarti_final}" if legiarti_final else None,
                wordCount=len(text.split()),
                checksum=_checksum(text),
                isValid=(len(text) > 20 and _is_vigueur(etat)),
            )
        except Exception as e:
            if self.verbose:
                log_error(f"Construction ArticleDefinition KO: {e}")
            return None

    @staticmethod
    def _extract_text(article_obj: Dict[str, Any]) -> str:
        def clean(t: str) -> str:
            t = re.sub(r"<[^>]+>", "", t)
            t = re.sub(r"\s+\n", "\n", t)
            t = re.sub(r"\n\s+", "\n", t)
            t = re.sub(r"[ \t]+", " ", t)
            t = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", t)
            return t.strip()

        if not isinstance(article_obj, dict):
            return clean(str(article_obj))

        for k in ("texteHtml", "texteArticle", "contenu", "content", "text", "texte", "value"):
            v = article_obj.get(k)
            if isinstance(v, str) and len(v.strip()) > 20:
                return clean(v)
            if isinstance(v, dict):
                for kk in ("texteHtml", "text", "content", "value", "texte"):
                    if kk in v and isinstance(v[kk], str) and len(v[kk].strip()) > 20:
                        return clean(v[kk])

        acc = []
        for k, v in article_obj.items():
            if isinstance(v, str) and v.strip():
                acc.append(v)
        return clean("\n".join(acc))

# ---------- Gestion Registry ----------
class LegalRegistryManager:
    def __init__(self, project_root: Path, verbose: bool = False):
        self.project_root = project_root
        self.verbose = verbose
        self.legal_dir = LEGAL_DIR
        self.registry_ts = REGISTRY_TS_FILE
        self.registry_file = REGISTRY_FILE

        self.parser = TypeScriptParser(self.registry_ts)

        client_id = os.getenv("LEGIFRANCE_CLIENT_ID")
        client_secret = os.getenv("LEGIFRANCE_CLIENT_SECRET")
        env = os.getenv("LEGIFRANCE_ENV", "prod").lower()

        self.api = LegifranceClient(client_id, client_secret, env=env, verbose=verbose) if (client_id and client_secret) else None
        if not self.api:
            log_warning("Pas de client PISTE initialisé (variables d'env manquantes).")

    def load_existing(self) -> Optional[LegalRegistry]:
        if not self.registry_file.exists():
            return None
        try:
            data = json.loads(self.registry_file.read_text(encoding="utf-8"))
            articles = {k: ArticleDefinition(**v) for k, v in data.get("articles", {}).items()}
            metadata = RegistryMetadata(**data.get("metadata"))
            return LegalRegistry(articles=articles, metadata=metadata)
        except Exception as e:
            log_warning(f"Lecture registry existant impossible: {e}")
            return None

    def _compute_metadata(self, articles: Dict[str, ArticleDefinition]) -> RegistryMetadata:
        total = len(articles)
        valid = sum(1 for a in articles.values() if a.isValid and a.text)
        coverage = (valid / total * 100.0) if total else 0.0
        content = json.dumps({k: asdict(v) for k, v in articles.items()}, sort_keys=True, ensure_ascii=False)
        checksum = hashlib.md5(content.encode("utf-8")).hexdigest()[:12]
        return RegistryMetadata(
            lastUpdated=_now_iso(),
            version="2.3.0",
            totalArticles=total,
            validArticles=valid,
            coverage=coverage,
            checksum=checksum,
        )

    def _save_registry(self, articles: Dict[str, ArticleDefinition]):
        self.legal_dir.mkdir(parents=True, exist_ok=True)
        metadata = self._compute_metadata(articles)
        payload = {
            "articles": {k: asdict(v) for k, v in articles.items()},
            "metadata": asdict(metadata),
        }
        REGISTRY_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
        log_success(f"Registry sauvé: {self.registry_file}")

    # ---- Sync complet
    def sync_all(self) -> LegalRegistry:
        if not self.api:
            raise RuntimeError("API PISTE non disponible (client_id/secret manquants).")

        log_info("🚀 Synchronisation complète (depuis registry.ts)")
        ts_defs = self.parser.extract_article_definitions()
        if not ts_defs:
            raise RuntimeError("Aucune définition TS trouvée.")

        existing = self.load_existing()
        existing_articles = existing.articles if existing else {}

        updated: Dict[str, ArticleDefinition] = {}
        changes: List[str] = []

        for art_num, ts_def in ts_defs.items():
            log_info(f"🔎 {ts_def.code} {art_num}")
            art = self.api.get_article_by_num(ts_def.code, art_num)
            if art:
                updated[art_num] = art
                prev = existing_articles.get(art_num)
                if prev and prev.checksum != art.checksum:
                    changes.append(f"{art_num} modifié")
                    log_change(f"Changement détecté: {art_num}")
                if art.isValid:
                    log_success(f"{art_num} ✓ ({art.wordCount} mots)")
                else:
                    log_warning(f"{art_num} récupéré mais non valide")
            else:
                log_warning(f"{art_num} introuvable ou vide (conservation éventuelle de l'existant)")
                if art_num in existing_articles:
                    updated[art_num] = existing_articles[art_num]

            time.sleep(0.2)  # doux avec PISTE

        self._save_registry(updated)
        meta = self._compute_metadata(updated)
        log_info(f"📊 {meta.totalArticles} articles, {meta.validArticles} valides ({meta.coverage:.0f}%)")
        if changes:
            log_change("🔄 Changements:")
            for c in changes[:10]:
                print("  -", c)
            if len(changes) > 10:
                print(f"  … +{len(changes)-10} autres")
        return LegalRegistry(updated, meta)

    # ---- Sync unitaire
    def sync_one(self, art_num: str) -> Optional[ArticleDefinition]:
        if not self.api:
            raise RuntimeError("API PISTE non disponible (client_id/secret manquants).")

        ts_defs = self.parser.extract_article_definitions()
        key = _norm_num(art_num)
        ts_def = ts_defs.get(key)
        if not ts_def:
            log_warning(f"{art_num} non présent dans registry.ts (ajoute-le d'abord).")
            return None

        log_info(f"🔧 Sync unitaire {ts_def.code} {key}")
        art = self.api.get_article_by_num(ts_def.code, key)
        if not art:
            log_error("Échec de récupération via PISTE.")
            return None

        existing = self.load_existing()
        articles = existing.articles if existing else {}
        articles[key] = art
        self._save_registry(articles)
        log_success(f"{key} mis à jour ({art.wordCount} mots)")
        return art

# ---------- CLI ----------
def main():
    parser = argparse.ArgumentParser(
        description="Synchronisation des références légales (TOC → LEGIARTI → getArticle, avec fallbacks)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  python legal_sync.py --sync-all
  python legal_sync.py --article L.217-3

Env requis :
  LEGIFRANCE_CLIENT_ID, LEGIFRANCE_CLIENT_SECRET, (optionnel) LEGIFRANCE_ENV=prod|sandbox
"""
    )
    parser.add_argument("--sync-all", action="store_true", help="Synchronise tous les articles déclarés dans registry.ts")
    parser.add_argument("--article", type=str, help="Synchronise un article (ex: 'L.217-3' ou '1641')")
    parser.add_argument("--project-root", type=Path, default=PROJECT_ROOT, help="Racine du projet")
    parser.add_argument("--verbose", action="store_true", help="Logs verbeux")
    args = parser.parse_args()

    try:
        mgr = LegalRegistryManager(args.project_root, verbose=args.verbose)

        if args.sync_all:
            mgr.sync_all()
            return 0
        if args.article:
            res = mgr.sync_one(args.article)
            return 0 if res else 1

        parser.print_help()
        return 1

    except KeyboardInterrupt:
        log_error("Interrompu par l'utilisateur")
        return 1
    except Exception as e:
        log_error(f"Erreur: {e}")
        if args.verbose:
            import traceback; traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
