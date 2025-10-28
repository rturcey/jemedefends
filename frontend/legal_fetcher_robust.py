#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
legal_fetcher_robust.py - API Légifrance PISTE (flow officiel + TOC fallback)
Flow DILA recommandé :
  1) POST /search (fond CODE_ETAT ou CODE_DATE) avec NUM_ARTICLE (EXACTE) + filtre NOM_CODE (+ DATE_VERSION.singleDate si besoin)
  2) POST /consult/getArticle avec l'id LEGIARTI récupéré

Fallback added si /search renvoie 500/0 résultat :
  → POST /consult/legi/tableMatieres (nature=CODE, textCid=LEGITEXT...) puis scan récursif pour trouver l’article par numéro
  → /consult/getArticle sur le LEGIARTI trouvé

Dernier recours : scraping minimal.

Version: 4.2
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from requests.adapters import HTTPAdapter, Retry

# ---------------- Utils ----------------

def _load_env_file(path: Optional[Path]) -> None:
    try:
        if not path:
            path = Path(".env")
        if path.exists():
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    except Exception:
        pass

def _now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")

def _to_epoch_millis(d: datetime) -> int:
    return int(d.replace(tzinfo=timezone.utc).timestamp() * 1000)

def _parse_date_to_millis(s: Optional[str]) -> Optional[int]:
    if not s:
        return None
    s = s.strip().lower()
    if s in ("today", "now", "aujourd'hui", "aujourdhui"):
        return _to_epoch_millis(datetime.now(timezone.utc))
    try:
        # ISO (YYYY-MM-DD…)
        return _to_epoch_millis(datetime.fromisoformat(s))
    except Exception:
        pass
    if s.isdigit():
        v = int(s)
        return v if v > 10_000_000_000 else v * 1000
    return None

# ---------------- Codes visés ----------------

CODE_NAMES = {
    "consommation": "Code de la consommation",
    "civil": "Code civil",
    "procedure_civile": "Code de procédure civile",
}

CODE_NAME_TO_LEGITEXT = {
    "Code de la consommation": "LEGITEXT000006069565",
    "Code civil": "LEGITEXT000006070721",
    "Code de procédure civile": "LEGITEXT000006070716",
}

def _guess_code_name_for(article_id: str) -> Optional[str]:
    s = (article_id or "").strip().upper()
    if s.startswith(("L.217-", "L.612-", "L.811-")):
        return CODE_NAMES["consommation"]
    m = re.match(r"^(\d+)", s.replace(".", "-").replace(" ", ""))
    if m:
        base = int(m.group(1))
        if base == 808 or 843 <= base <= 847:
            return CODE_NAMES["procedure_civile"]
        return CODE_NAMES["civil"]
    return None

# ---------------- Client API ----------------

class LegifranceAPIClient:
    AUTH_URLS = {
        "prod": "https://oauth.piste.gouv.fr/api/oauth/token",
        "sandbox": "https://sandbox-oauth.piste.gouv.fr/api/oauth/token",
    }
    BASE_URLS = {
        "prod": "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
        "sandbox": "https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app",
    }

    def __init__(self, client_id: Optional[str], client_secret: Optional[str], env: str = "prod", verbose: bool = False):
        self.verbose = verbose
        self.env = (os.getenv("LEGIFRANCE_ENV") or env or "prod").lower()
        if self.env not in ("prod", "sandbox"):
            self.env = "prod"

        self.client_id = client_id or os.getenv("LEGIFRANCE_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("LEGIFRANCE_CLIENT_SECRET")

        self.AUTH_URL = self.AUTH_URLS[self.env]
        self.BASE_URL = self.BASE_URLS[self.env]

        self.access_token: Optional[str] = None
        self.token_expiry: Optional[datetime] = None

        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "fr",
            "User-Agent": "jemedefends-legal-fetcher/4.2 (+https://jemedefends.fr)",
        })
        if self.client_id:
            self.session.headers.setdefault("X-Client-Id", self.client_id)

        # Moins d’acharnement sur 5xx pour passer au fallback plus vite
        retries = Retry(
            total=3,
            backoff_factor=0.7,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset(["GET", "POST"]),
        )
        self.session.mount("https://", HTTPAdapter(max_retries=retries))

        if self.client_id and self.client_secret:
            ok = self._authenticate()
            if not ok:
                print(" Auth PISTE échouée : tentative en mode 'public' (limitations possibles)")
        else:
            print(" Clés API non configurées (LEGIFRANCE_CLIENT_ID/SECRET). Mode public limité + fallback.")

    # ---- Auth

    def _authenticate(self) -> bool:
        try:
            if self.verbose:
                print(f"🔐 [{_now_iso()}] Auth PISTE ({self.env})…")
            data = {
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "scope": "openid",
            }
            headers = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"}
            r = requests.post(self.AUTH_URL, data=data, headers=headers, timeout=30)
            if r.status_code != 200:
                print(f"❌ Auth PISTE {r.status_code}: {r.text[:400]}")
                return False
            js = r.json() or {}
            token = js.get("access_token")
            exp = int(js.get("expires_in", 3600))
            if not token:
                print("❌ Auth PISTE: pas de access_token dans la réponse")
                return False
            self.access_token = token
            self.token_expiry = datetime.now(timezone.utc) + timedelta(seconds=exp - 120)
            self.session.headers["Authorization"] = f"Bearer {token}"
            if self.verbose:
                print("Auth OK")
            return True
        except Exception as e:
            print(f"❌ Exception auth PISTE: {e}")
            return False

    def _maybe_refresh_token(self) -> None:
        if self.access_token and self.token_expiry and datetime.now(timezone.utc) >= self.token_expiry:
            if self.verbose:
                print("🔁 Token proche/échu → refresh…")
            self._authenticate()

    def _request(self, method: str, url: str, **kwargs) -> requests.Response:
        self._maybe_refresh_token()
        resp = self.session.request(method, url, timeout=30, **kwargs)

        if resp.status_code in (401, 403) and self.client_id and self.client_secret:
            if self.verbose:
                print(f"ℹ️ {resp.status_code} → refresh token puis retry…")
            if self._authenticate():
                resp = self.session.request(method, url, timeout=30, **kwargs)

        if resp.status_code == 429:
            retry_after = resp.headers.get("Retry-After")
            sleep_s = 1.5
            if retry_after:
                try:
                    sleep_s = max(sleep_s, float(retry_after))
                except ValueError:
                    pass
            if self.verbose:
                print(f"⏳ 429 → pause {sleep_s:.1f}s puis retry…")
            time.sleep(sleep_s)
            resp = self.session.request(method, url, timeout=30, **kwargs)

        return resp

    # ---- Search (flow officiel)

    @staticmethod
    def _num_variants_for_search(article_id: str) -> List[str]:
        s = (article_id or "").strip().replace("—", "-").replace("–", "-")
        s_up = s.upper()
        variants = set()
        variants.add(s_up)
        variants.add(re.sub(r"^([A-Z])\.\s*", r"\1", s_up))                 # L.217-3 → L217-3
        variants.add(re.sub(r"^([A-Z])\s*", r"\1 ", variants.copy().pop())) # L217-3 → L 217-3
        variants.add(re.sub(r"^[A-Z][\.\s]*", "", s_up))                    # L.217-3 → 217-3
        variants = {v.replace(".", "-") for v in variants}
        ordered = sorted(variants, key=lambda x: (0 if re.match(r"^[A-Z]\d", x) else (1 if re.match(r"^[A-Z]\s", x) else 2), len(x)))
        return ordered

    def _build_search_payload(self, num_value: str, code_name: Optional[str], date_ms: Optional[int]) -> Dict[str, Any]:
        fond = "CODE_DATE" if date_ms else "CODE_ETAT"
        filtres = []
        if code_name:
            filtres.append({"facette": "NOM_CODE", "valeurs": [code_name]})
        if date_ms:
            filtres.append({"facette": "DATE_VERSION", "singleDate": date_ms})
        else:
            filtres.append({"facette": "TEXT_LEGAL_STATUS", "valeur": "VIGUEUR"})
        return {
            "recherche": {
                "champs": [{
                    "typeChamp": "NUM_ARTICLE",
                    "criteres": [{"typeRecherche": "EXACTE", "valeur": num_value, "operateur": "ET"}],
                    "operateur": "ET",
                }],
                "filtres": filtres,
                "pageNumber": 1,
                "pageSize": 10,
                "operateur": "ET",
                "sort": "PERTINENCE",
                "typePagination": "ARTICLE",
            },
            "fond": fond,
        }

    def _extract_results_array(self, data: Any) -> List[dict]:
        containers: List[dict] = []
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            for k in ("results", "content", "data", "response", "items"):
                v = data.get(k)
                if isinstance(v, list):
                    containers.extend(v)
                elif isinstance(v, dict) and isinstance(v.get("results"), list):
                    containers.extend(v["results"])
        return containers

    def _pick_legiarti_from_results(self, results: List[dict]) -> Optional[str]:
        for r in results:
            for k in ("id", "cid", "articleId"):
                val = r.get(k)
                if isinstance(val, str) and val.startswith("LEGIARTI"):
                    return val
        for r in results:
            sub = r.get("article") or r.get("content") or r.get("data")
            if isinstance(sub, dict):
                for _, vv in sub.items():
                    if isinstance(vv, str) and vv.startswith("LEGIARTI"):
                        return vv
        return None

    def search_article_legiarti(self, article_id: str, code_name: Optional[str], date_ms: Optional[int]) -> Optional[str]:
        url = f"{self.BASE_URL}/search"
        tried = 0
        for num_val in self._num_variants_for_search(article_id):
            body = self._build_search_payload(num_val, code_name, date_ms)
            tried += 1
            if self.verbose:
                print(f"\n🔎 /search try#{tried} fond={body['fond']} NUM_ARTICLE='{num_val}' code='{code_name or '∅'}' date_ms={date_ms or '∅'}")
            r = self._request("POST", url, json=body)
            if r.status_code != 200:
                if self.verbose:
                    try:
                        msg = r.json()
                    except Exception:
                        msg = r.text
                    print(f"  ↳ status {r.status_code}: {str(msg)[:240]}")
                if r.status_code in (500, 502, 503, 504):
                    # laisse la main au fallback TOC
                    break
                continue
            data = r.json() or {}
            results = self._extract_results_array(data)
            if not results:
                if self.verbose:
                    print("  ↳ 0 résultat")
                continue
            legiarti = self._pick_legiarti_from_results(results)
            if legiarti:
                if self.verbose:
                    print(f"  ↳ LEGIARTI trouvé: {legiarti}")
                return legiarti
        return None

    # ---- Consult

    def consult_get_article(self, legiarti_id: str) -> Optional[Dict[str, Any]]:
        url = f"{self.BASE_URL}/consult/getArticle"
        r = self._request("POST", url, json={"id": legiarti_id})
        if r.status_code != 200:
            self._log_api_error("consult/getArticle", r)
            return None
        data = r.json() or {}
        art = data.get("article") or data
        text = self._extract_text_from_api(art)
        if not text or len(text) < 20:
            if self.verbose:
                print("Texte trop court/invalide (consult/getArticle)")
            return None
        etat = (art.get("etat") or "VIGUEUR").upper()
        date_debut = art.get("dateDebut") or art.get("dateDebutVersion")
        return {
            "text": text.strip(),
            "lastModified": date_debut,
            "status": "VIGUEUR" if "VIGUEUR" in etat else "ABROGE",
            "wordCount": len(text.split()),
            "apiData": art,
            "cid": art.get("cid") or art.get("id"),
            "source": "LEGIFRANCE_API",
        }

    # ---- Fallback TOC (consult/legi/tableMatieres)

    def consult_legi_table_matieres(self, code_legitext: str) -> Optional[dict]:
        """
        Appelle /consult/legi/tableMatieres pour un CODE.
        Payload minimal conforme au catalogue récent: {"nature":"CODE","textCid":LEGITEXT...}
        """
        url = f"{self.BASE_URL}/consult/legi/tableMatieres"
        body_opts = [
            {"nature": "CODE", "textCid": code_legitext},  # forme la plus courante
            {"nature": "CODE", "cid": code_legitext},      # variante tolérante si 'textCid' n'est pas reconnu
        ]
        for i, body in enumerate(body_opts, 1):
            if self.verbose:
                print(f"📚 TOC try#{i} {body}")
            r = self._request("POST", url, json=body)
            if r.status_code == 200:
                try:
                    return r.json()
                except Exception:
                    return None
            else:
                if self.verbose:
                    self._log_api_error("consult/legi/tableMatieres", r)
        return None

    @staticmethod
    def _norm_num_for_match(s: str) -> str:
        return s.upper().replace(" ", "").replace(".", "-")

    def _find_legiarti_in_toc(self, toc: Any, wanted_variants: List[str]) -> Optional[str]:
        """
        Parcours récursif du JSON renvoyé par /consult/legi/tableMatieres.
        Cherche un dict qui porte un id/cid LEGIARTI et un champ num/numero/titre qui matche une des variantes.
        """
        wanted_set = {self._norm_num_for_match(v) for v in wanted_variants}

        def _walk(obj: Any) -> Optional[str]:
            if isinstance(obj, dict):
                # récup id article
                legiarti = None
                for k in ("id", "cid", "articleId", "article_id"):
                    v = obj.get(k)
                    if isinstance(v, str) and v.startswith("LEGIARTI"):
                        legiarti = v
                        break
                # récup num potentiel
                num_fields = []
                for k in ("num", "numero", "computedNums", "titre", "title", "libelle"):
                    v = obj.get(k)
                    if isinstance(v, str):
                        num_fields.append(v)
                    elif isinstance(v, list):
                        num_fields.extend([str(x) for x in v])
                if legiarti and num_fields:
                    for val in num_fields:
                        # essaie motifs usuels : "Article L. 217-3", "L.217-3", etc.
                        for piece in re.findall(r"[A-Z]?\s*\.?\s*\d+(?:[-–—]\d+)?", val.upper()):
                            if self._norm_num_for_match(piece) in wanted_set:
                                return legiarti
                        if self._norm_num_for_match(val) in wanted_set:
                            return legiarti

                # descente récursive
                for v in obj.values():
                    res = _walk(v)
                    if res:
                        return res
            elif isinstance(obj, list):
                for it in obj:
                    res = _walk(it)
                    if res:
                        return res
            return None

        return _walk(toc)

    # ---- Orchestrateur

    def get_article(self, article_id: str, code_name_hint: Optional[str], date_ms: Optional[int]) -> Optional[Dict[str, Any]]:
        # 1) Flow officiel /search → /consult/getArticle
        legiarti = self.search_article_legiarti(article_id, code_name_hint, date_ms)
        if not legiarti and code_name_hint:
            if self.verbose:
                print("ℹ️ Aucune correspondance avec filtre code → nouvel essai sans NOM_CODE")
            legiarti = self.search_article_legiarti(article_id, None, date_ms)

        if legiarti:
            item = self.consult_get_article(legiarti)
            if item:
                item["url"] = f"https://www.legifrance.gouv.fr/codes/article_lc/{item.get('cid')}"
                return item

        # 2) Fallback TOC (si on sait quel code viser)
        if code_name_hint:
            code_id = CODE_NAME_TO_LEGITEXT.get(code_name_hint)
            if code_id:
                if self.verbose:
                    print(f"🧭 Fallback TOC sur {code_name_hint} ({code_id})…")
                toc = self.consult_legi_table_matieres(code_id)
                if toc:
                    variants = self._num_variants_for_search(article_id)
                    legiarti = self._find_legiarti_in_toc(toc, variants)
                    if legiarti:
                        if self.verbose:
                            print(f"  ↳ LEGIARTI via TOC: {legiarti}")
                        item = self.consult_get_article(legiarti)
                        if item:
                            item["url"] = f"https://www.legifrance.gouv.fr/codes/article_lc/{item.get('cid')}"
                            return item

        return None

    # ---- Helpers extraction/log

    @staticmethod
    def _clean_api_text(text: str) -> str:
        if not text:
            return ""
        text = re.sub(r"<[^>]+>", "", text)
        text = re.sub(r"\s+\n", "\n", text)
        text = re.sub(r"\n\s+", "\n", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", text)
        return text.strip()

    def _extract_text_from_api(self, article_content: Dict[str, Any]) -> str:
        if not isinstance(article_content, dict):
            return self._clean_api_text(str(article_content))
        for k in ("texteArticle", "texteHtml", "contenu", "content", "text", "texte", "value"):
            v = article_content.get(k)
            if isinstance(v, str):
                t = self._clean_api_text(v)
                if len(t) > 20:
                    return t
            elif isinstance(v, dict):
                for kk in ("text", "content", "value", "texte", "texteHtml"):
                    if kk in v:
                        t = self._clean_api_text(str(v[kk]))
                        if len(t) > 20:
                            return t
        acc = []
        for k, v in article_content.items():
            if isinstance(v, str) and v:
                acc.append(v)
        return self._clean_api_text("\n".join(acc))

    def _log_api_error(self, phase: str, resp: requests.Response) -> None:
        try:
            payload = resp.json()
        except Exception:
            payload = resp.text
        print(f"❌ API {phase} {resp.status_code}: {str(payload)[:600]}")

# ---------------- Fallback scraping ----------------

class MinimalFallbackScraper:
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "fr-FR,fr;q=0.9",
        })
        retries = Retry(
            total=3,
            backoff_factor=0.6,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset(["GET"]),
        )
        self.session.mount("https://", HTTPAdapter(max_retries=retries))

    def search_legifrance(self, article_id: str) -> Optional[str]:
        try:
            url = "https://www.legifrance.gouv.fr/search/code"
            params = {"query": f"article {article_id}", "typePagination": "DEFAUT"}
            r = self.session.get(url, params=params, timeout=30)
            if r.status_code != 200:
                if self.verbose:
                    print(f"❌ Fallback search {r.status_code}")
                return None
            content = r.text
            for m in re.findall(r'href="([^"]*article_lc/[^"]*)"', content):
                if "LEGIARTI" in m:
                    return f"https://www.legifrance.gouv.fr{m}" if m.startswith("/") else m
            return None
        except Exception as e:
            print(f"❌ Erreur fallback search: {e}")
            return None

    def get_article_from_url(self, url: str) -> Optional[Dict[str, Any]]:
        try:
            r = self.session.get(url, timeout=30)
            r.raise_for_status()
            try:
                from bs4 import BeautifulSoup
            except ImportError:
                print("❌ BeautifulSoup requis pour le fallback. pip install beautifulsoup4")
                return None
            soup = BeautifulSoup(r.content, "html.parser")
            for e in soup.find_all(["nav", "header", "footer", "script", "style"]):
                e.decompose()
            main = soup.find("article") or soup.find(class_="article") or soup.find(id="article") or soup.find("main") or soup
            text = main.get_text(separator="\n", strip=True)
            text = re.sub(r"\n\s*\n", "\n\n", text)
            text = re.sub(r"[ \t]+", " ", text).strip()
            if len(text) < 20:
                return None
            return {
                "text": text,
                "lastModified": None,
                "status": "VIGUEUR",
                "source": "LEGIFRANCE_FALLBACK",
                "url": url,
                "wordCount": len(text.split()),
            }
        except Exception as e:
            print(f"❌ Erreur fallback scraping: {e}")
            return None

# ---------------- Orchestrateur ----------------

class LegalUpdater:
    def __init__(self, project_root: Path, verbose: bool, env: str, client_id: Optional[str], client_secret: Optional[str], at_date_ms: Optional[int]):
        self.project_root = project_root
        self.constants_dir = project_root / "frontend" / "src" / "constants"
        self.output_file = self.constants_dir / "legal_texts.generated.json"
        self.verbose = verbose
        self.at_date_ms = at_date_ms

        self.api = LegifranceAPIClient(client_id, client_secret, env=env, verbose=verbose)
        self.fallback = MinimalFallbackScraper(verbose=verbose)

    def update_all_articles(self) -> Dict[str, Dict[str, Any]]:
        articles = (
            [f"L.217-{i}" for i in range(3, 29)] +
            [f"L.612-{i}" for i in range(1, 6)] +
            ["L.811-1"] +
            [str(i) for i in [1641, 1642, 1643, 1644, 1645, 1646, 1647, 1648, 1649]] +
            ["1642.1", "1646.1"] +
            [str(i) for i in [808, 843, 844, 845, 846, 847]]
        )

        results: Dict[str, Dict[str, Any]] = {}
        api_ok = 0
        fb_ok = 0
        errs = 0

        total = len(articles)
        print(f"🚀 Récupération de {total} articles via /search + /consult/getArticle…")

        for idx, aid in enumerate(articles):
            pct = int((idx / total) * 100)
            bar = "#" * (pct // 2) + "." * (50 - (pct // 2))
            print(f"\r📊 [{bar}] {pct}% - {aid}", end="", flush=True)

            try:
                if self.verbose:
                    print(f"\n🔍 {aid}…")
                code_hint = _guess_code_name_for(aid)
                item = self.api.get_article(aid, code_hint, self.at_date_ms)
                if item and item.get("text"):
                    results[aid] = {
                        "text": item["text"],
                        "lastVerified": datetime.now().strftime("%Y-%m-%d"),
                        "lastModified": item.get("lastModified"),
                        "status": item.get("status", "VIGUEUR"),
                        "source": item.get("source", "LEGIFRANCE_API"),
                        "url": item.get("url"),
                        "wordCount": item.get("wordCount", 0),
                    }
                    api_ok += 1
                    time.sleep(0.25)
                    continue

                if self.verbose:
                    print("API: pas de résultat → fallback scraping…")
                url = self.fallback.search_legifrance(aid)
                if url:
                    fb = self.fallback.get_article_from_url(url)
                    if fb and fb.get("text"):
                        results[aid] = {
                            "text": fb["text"],
                            "lastVerified": datetime.now().strftime("%Y-%m-%d"),
                            "lastModified": fb.get("lastModified"),
                            "status": fb.get("status", "VIGUEUR"),
                            "source": "LEGIFRANCE_FALLBACK",
                            "url": fb.get("url"),
                            "wordCount": fb.get("wordCount", 0),
                        }
                        fb_ok += 1
                        time.sleep(0.25)
                        continue

                print(f"\n❌ {aid}: Échec API & fallback")
                errs += 1
            except Exception as e:
                print(f"\n❌ {aid}: Exception {e}")
                errs += 1

            time.sleep(0.2)

        print(f"\n\n📊 Récap:")
        print(f"  🎯 API : {api_ok}")
        print(f"  🔄 Fallback : {fb_ok}")
        print(f"  ❌ Échecs : {errs}")
        print(f"  📈 Taux global : {int((api_ok + fb_ok) / total * 100)}%")

        if results:
            self._save_results(results)
        return results

    def _save_results(self, results: Dict[str, Dict[str, Any]]) -> None:
        self.constants_dir.mkdir(parents=True, exist_ok=True)
        metadata = {
            "generatedAt": _now_iso(),
            "totalArticles": len(results),
            "source": "legal_fetcher_robust.py",
            "version": "4.2",
            "apiUsed": "LEGIFRANCE_PISTE",
            "sources": {
                source: sum(1 for r in results.values() if r.get("source") == source)
                for source in set(r.get("source", "UNKNOWN") for r in results.values())
            },
        }
        final_data = {"_metadata": metadata, **results}
        with open(self.output_file, "w", encoding="utf-8") as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2, sort_keys=True)
        print(f"💾 Sauvegardé: {self.output_file} ({self.output_file.stat().st_size // 1024} KB)")

# ---------------- CLI ----------------

def main():
    parser = argparse.ArgumentParser(
        description="Récupérer des articles via l’API Légifrance (flow officiel /search+consult + fallback TOC)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Article en vigueur aujourd'hui (fond CODE_ETAT)
  python3 legal_fetcher_robust.py --one "L.217-3"

  # Article à une date donnée (fond CODE_DATE)
  python3 legal_fetcher_robust.py --one "L.217-3" --at-date 2020-01-01

Config:
  LEGIFRANCE_CLIENT_ID=xxx
  LEGIFRANCE_CLIENT_SECRET=yyy
  LEGIFRANCE_ENV=prod|sandbox
        """
    )
    parser.add_argument("--update-all", action="store_true", help="Met à jour tous les articles prédéfinis")
    parser.add_argument("--project-root", type=Path, default=Path.cwd().parent, help="Racine du projet")
    parser.add_argument("--env", choices=["prod", "sandbox"], default=os.getenv("LEGIFRANCE_ENV", "prod").lower())
    parser.add_argument("--client-id", type=str, help="LEGIFRANCE_CLIENT_ID (PISTE)")
    parser.add_argument("--client-secret", type=str, help="LEGIFRANCE_CLIENT_SECRET (PISTE)")
    parser.add_argument("--verbose", action="store_true", help="Logs détaillés")
    parser.add_argument("--one", type=str, help="Tester un seul article (ex: 'L.217-3')")
    parser.add_argument("--env-file", type=Path, default=None, help="Chemin d'un fichier .env à charger")
    parser.add_argument("--at-date", type=str, default=None, help="Date (YYYY-MM-DD|ISO|'today') pour la version recherchée")

    args = parser.parse_args()
    _load_env_file(args.env_file)

    client_id = args.client_id or os.getenv("LEGIFRANCE_CLIENT_ID")
    client_secret = args.client_secret or os.getenv("LEGIFRANCE_CLIENT_SECRET")
    at_date_ms = _parse_date_to_millis(args.at_date)

    if not (args.update_all or args.one):
        parser.print_help()
        return 1

    try:
        print("🏛️  API Légifrance (flow officiel: /search → /consult/getArticle; fallback TOC si 5xx/0 résultat)\n")
        if not (client_id and client_secret):
            print("ℹ️  Conseil: configure LEGIFRANCE_CLIENT_ID / LEGIFRANCE_CLIENT_SECRET pour éviter 401/quotas.\n")

        updater = LegalUpdater(
            args.project_root, verbose=args.verbose, env=args.env,
            client_id=client_id, client_secret=client_secret, at_date_ms=at_date_ms
        )

        if args.one:
            aid = args.one.strip()
            hint = _guess_code_name_for(aid)
            item = updater.api.get_article(aid, hint, at_date_ms)
            if item and item.get("text"):
                print(f"OK {aid} — {item.get('wordCount', 0)} mots")
                print(f"URL: {item.get('url')}")
                return 0
            print("API: échec, essai fallback scraping…")
            url = updater.fallback.search_legifrance(aid)
            if url:
                fb = updater.fallback.get_article_from_url(url)
                if fb and fb.get("text"):
                    print(f"Fallback OK {aid} — {fb.get('wordCount', 0)} mots")
                    print(f"URL: {fb.get('url')}")
                    return 0
            print("❌ Échec total")
            return 1

        results = updater.update_all_articles()
        if not results:
            print("❌ Aucun article récupéré")
            return 1
        print("\nMise à jour terminée")
        return 0

    except KeyboardInterrupt:
        print("\n❌ Interrompu par l'utilisateur")
        return 1
    except Exception as e:
        print(f"❌ Erreur fatale: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
