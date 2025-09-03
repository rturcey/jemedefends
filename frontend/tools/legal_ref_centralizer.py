#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
legal_ref_centralizer.py

Scanne un projet pour détecter les références au Code de la consommation (explicites et implicites),
propose les remplacements vers les constantes centralisées LEGAL, affiche un diff par changement
et demande confirmation avant d'appliquer.

Usage:
  python legal_ref_centralizer.py --root ./src
  python legal_ref_centralizer.py --root ./ --explicit-only
  python legal_ref_centralizer.py --root ./src --include-ext .ts,.tsx,.js,.jsx,.mdx,.md
  python legal_ref_centralizer.py --root ./src --yes --backup
  python legal_ref_centralizer.py --help

Notes:
- Le script insère automatiquement:
    import { LEGAL } from '@/constants/legal';
  dans les fichiers TS/TSX/JS/JSX/MDX si nécessaire (en respectant "use client" et le bloc d'import).
- Pour les fichiers .md (Markdown non-MDX), deux options:
    1) laisser tel quel (insertion brute du texte "(Art. L…. Code de la consommation)"),
    2) convertir en .mdx (renommage + import LEGAL + interpolation JSX {LEGAL...}).
  Le script te demandera quoi faire la première fois et retiendra ton choix pour la session.
"""

import argparse
import os
import re
import sys
import pathlib
import difflib
from typing import List, Tuple, Optional, Dict

# ===========================
# Configuration : Patterns
# ===========================

# Références explicites -> LEGAL.xxx.ref
EXPLICIT_MAP: List[Tuple[re.Pattern, str]] = [
    (re.compile(r"Art\.?\s*L\.?\s*217-3", re.IGNORECASE), "LEGAL.L217_3.ref"),
    (re.compile(r"Art\.?\s*L\.?\s*217-5", re.IGNORECASE), "LEGAL.L217_5.ref"),
    (re.compile(r"Art\.?\s*L\.?\s*217-7", re.IGNORECASE), "LEGAL.L217_7.ref"),
    (re.compile(r"Art\.?\s*L\.?\s*224-25-12", re.IGNORECASE), "LEGAL.L224_25_12.ref"),
    (re.compile(r"Art\.?\s*L\.?\s*224-25-13", re.IGNORECASE), "LEGAL.L224_25_13.ref"),
    (re.compile(r"(?:Article|Art\.)\s+liminaire", re.IGNORECASE), "LEGAL.ARTICLE_LIMINAIRE.ref"),
]

# Indices implicites -> proposition par défaut (peut être confirmée/ajustée)
IMPLICIT_CUES: List[Tuple[re.Pattern, List[str], str]] = [
    # pattern, liste des suggestions LEGAL.*.ref par défaut (par ordre de priorité), description
    (re.compile(r"\b2\s*ans\b|\bdeux\s*ans\b", re.IGNORECASE), ["LEGAL.L217_3.ref"], "Durée biens (2 ans)"),
    (re.compile(r"\b24\s*mois\b|\bvingt[-\s]?quatre\s*mois\b", re.IGNORECASE), ["LEGAL.L217_7.ref"], "Présomption 24 mois"),
    (re.compile(r"\b12\s*mois\b|\bdouze\s*mois\b", re.IGNORECASE), ["LEGAL.L217_7.ref"], "Présomption 12 mois (occasion)"),
    (re.compile(r"\boccasion\b|\bbien[s]?\s*d'?occasion\b", re.IGNORECASE), ["LEGAL.L217_7.ref"], "Biens d'occasion"),
    (re.compile(r"\bcontenu(x)? numérique(s)?\b|\bservice(s)? numérique(s)?\b", re.IGNORECASE),
     ["LEGAL.L224_25_12.ref", "LEGAL.L224_25_13.ref"], "Numérique"),
    (re.compile(r"\bprofessionnel(le)?\b.*\bconsommateur(trice)?\b", re.IGNORECASE),
     ["LEGAL.L217_3.ref", "LEGAL.ARTICLE_LIMINAIRE.ref"], "Pro ↔ conso"),
    (re.compile(r"\bgarantie\s+l[ée]gale\b|\bgarantie\s+de\s+conformit[ée]\b", re.IGNORECASE),
     ["LEGAL.L217_3.ref"], "Garantie de conformité"),
    (re.compile(r"\bconformit[ée]\b", re.IGNORECASE),
     ["LEGAL.L217_5.ref"], "Définition/critères de conformité"),
]

# Extensions
DEFAULT_INCLUDE_EXT = [".ts", ".tsx", ".js", ".jsx", ".mdx", ".md"]
CODE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mdx"}  # gèrent import LEGAL
TEXT_EXTS = set(DEFAULT_INCLUDE_EXT)


# ===========================
# Utilitaires
# ===========================

def load_text(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        print(f"[WARN] Impossible de lire {path}: {e}", file=sys.stderr)
        return ""

def save_text(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def unified_diff_str(a: str, b: str, label_a: str, label_b: str, n: int = 3) -> str:
    return "".join(
        difflib.unified_diff(
            a.splitlines(keepends=True),
            b.splitlines(keepends=True),
            fromfile=label_a,
            tofile=label_b,
            n=n,
        )
    )

def ask(prompt: str, default: Optional[str] = None, choices: Optional[List[str]] = None) -> str:
    while True:
        suf = f" [{'/'.join(choices)}]" if choices else ""
        if default:
            suf += f" (default: {default})"
        ans = input(f"{prompt}{suf}: ").strip().lower()
        if not ans and default:
            ans = default
        if not choices or ans in choices:
            return ans
        print(f"Veuillez répondre par {', '.join(choices)}.")

def ensure_import_legal(src_text: str, ext: str) -> str:
    """Insère import { LEGAL } … si nécessaire (TS/TSX/JS/JSX/MDX). Respecte 'use client' et le bloc d'import."""
    if ext not in CODE_EXTS:
        return src_text
    if re.search(r"from\s+['\"]@/constants/legal['\"]", src_text):
        return src_text

    lines = src_text.splitlines(keepends=True)
    i = 0
    # Conserver 'use client' en tête
    if i < len(lines) and re.match(r"^\s*['\"]use client['\"]\s*;?\s*$", lines[i]):
        i += 1
    # Passer le bloc d'import
    while i < len(lines) and re.match(r"^\s*import\b", lines[i]):
        i += 1
    lines.insert(i, "import { LEGAL } from '@/constants/legal';\n")
    return "".join(lines)

def to_template_string(s: str) -> str:
    """Convertit '...text...' ou "...text..." en `...text...`"""
    if len(s) >= 2 and s[0] in "\"'" and s[-1] == s[0]:
        return f"`{s[1:-1]}`"
    return s  # déjà backticks ou autre

def replace_explicit_in_string_literal(literal: str) -> Optional[str]:
    """Si un littéral contient une ref explicite, remplace par ${LEGAL...} et renvoie le nouveau littéral (backticks)."""
    if len(literal) < 2:
        return None
    quote = literal[0]
    if quote not in "\"'":
        return None
    inner = literal[1:-1]
    replaced_inner = inner
    changed = False
    for pat, key in EXPLICIT_MAP:
        if re.search(pat, replaced_inner):
            replaced_inner = re.sub(pat, f"${{{key}}}", replaced_inner)
            changed = True
    if changed:
        return f"`{replaced_inner}`"
    return None

def iter_string_literals(text: str) -> List[Tuple[Tuple[int,int], str]]:
    """
    Renvoie une liste des littéraux de chaînes ('...' ou "....") trouvés dans le fichier.
    Très simple (non-parseur), suffisant dans la majorité des cas.
    """
    results: List[Tuple[Tuple[int,int], str]] = []
    # Match "..." ou '...' (naïf mais efficace) — ignore les backticks on traite ailleurs
    str_pat = re.compile(r"(['\"])(?:(?=(\\?))\2.)*?\1", re.DOTALL)
    for m in str_pat.finditer(text):
        results.append(((m.start(), m.end()), m.group(0)))
    return results

def apply_replacements(text: str, replacements: List[Tuple[int, int, str]]) -> str:
    """Applique une liste de remplacements (start, end, new_str) sur text (indices absolus), du fond vers le début."""
    replacements_sorted = sorted(replacements, key=lambda t: t[0], reverse=True)
    out = text
    for start, end, new_str in replacements_sorted:
        out = out[:start] + new_str + out[end:]
    return out

# ===========================
# Détection & proposition
# ===========================

def detect_explicit_candidates(text: str) -> List[Tuple[Tuple[int,int], str, str]]:
    """
    Détecte les références explicites dans les littéraux.
    Retourne [(span, old_literal, new_literal_with_template)], par occurrence.
    """
    cands = []
    for (start, end), lit in iter_string_literals(text):
        new_lit = replace_explicit_in_string_literal(lit)
        if new_lit:
            cands.append(((start, end), lit, new_lit))
    return cands

def detect_implicit_candidates_lines(text: str) -> List[Tuple[int, str, List[str]]]:
    """
    Détecte des indices implicites par ligne entière (pour review interactive).
    Retourne [(line_number, line_text, suggestions[])]
    """
    rows = []
    lines = text.splitlines()
    for i, line in enumerate(lines, start=1):
        suggestions: List[str] = []
        for pat, keys, _desc in IMPLICIT_CUES:
            if re.search(pat, line):
                # éviter doublons
                for k in keys:
                    if k not in suggestions:
                        suggestions.append(k)
        # Mention générique sans article
        if re.search(r"\bCode\s+de\s+la\s+consommation\b", line, re.IGNORECASE) and not re.search(r"L\.\s*\d", line):
            if "LEGAL.L217_3.ref" not in suggestions:
                suggestions.append("LEGAL.L217_3.ref")
        if suggestions:
            rows.append((i, line, suggestions))
    return rows

def propose_inline_annotation(line: str, legal_key: str, is_code_or_mdx: bool) -> str:
    """
    Propose un ajout inline de la ref.
    - Pour code/MDX: suffixer avec ` — ${LEGAL.X.ref}` si la ligne contient déjà une string template,
      sinon si la ligne contient "..."/'...' on ajoute à l'intérieur en la convertissant en template string si besoin,
      à défaut on suffixe la ligne par + ` — ${LEGAL...}` dans le code.
    - Pour .md: ajoute une parenthèse textuelle "(Art. ...)" (pas de LEGAL import possible) — à moins de convertir en MDX.
    """
    if not is_code_or_mdx:
        # Markdown simple: insertion textuelle (non LEGAL)
        # On reste non destructif : on ajoute " (voir Code de la consommation)" si pas d’article exact
        # Mais l’objectif est d’utiliser LEGAL -> on proposera option de conversion en MDX ailleurs.
        return line  # par défaut: ne pas modifier en md ici

    # code/MDX: si on trouve une string, on annote dedans
    str_pat = re.compile(r"(['\"])(?:(?=(\\?))\2.)*?\1")
    m = str_pat.search(line)
    if m:
        lit = m.group(0)
        # transforme en template string et suffixe avec — ${LEGAL...}
        core = lit[1:-1]
        new = f"`{core} — ${{{legal_key}}}`"
        return line[:m.start()] + new + line[m.end():]

    # Pas de string dans la ligne: insérer un ajout JS/TS en bout… mais on ne sait pas où.
    # Par prudence, on ne modifie pas si la ligne n'a pas de string, on laissera l'utilisateur choisir manuellement.
    return line

# ===========================
# Application interactive
# ===========================

def process_file(path: str, args, remembered_choices) -> bool:
    """
    Traite un fichier :
    - propose les remplacements explicites (littéraux -> template LEGAL)
    - liste les lignes implicites, propose annotation/saut/choix de clé
    - demande confirmation avant d'écrire
    Retourne True si modifié.
    """
    ext = pathlib.Path(path).suffix.lower()
    is_code = ext in CODE_EXTS
    is_mdx = ext == ".mdx"
    is_md = ext == ".md"

    original = load_text(path)
    if not original:
        return False

    new_text = original
    applied_repls: List[Tuple[int,int,str]] = []

    # 1) Explicites sur littéraux
    if not args.implicit_only:
        explicit_cands = detect_explicit_candidates(new_text)
        if explicit_cands:
            print(f"\n[EXPLICITES] {path} : {len(explicit_cands)} occurrence(s) à valider")
            for idx, (span, old_lit, new_lit) in enumerate(explicit_cands, start=1):
                snippet_old = new_text[max(0, span[0]-80):min(len(new_text), span[1]+80)]
                print(f"\n  Occurrence #{idx}:")
                print(f"    Ancien: {old_lit}")
                print(f"    Propos.: {new_lit}")
                if args.yes:
                    ans = "y"
                else:
                    ans = ask("Appliquer ce remplacement ?", default="y", choices=["y","n","a","q"])
                if ans == "q":
                    print("  -> Abandon.")
                    sys.exit(1)
                if ans == "a":
                    # appliquer toutes les occurrences restantes
                    for j in range(idx, len(explicit_cands)+1):
                        sp, ol, nl = explicit_cands[j-1]
                        applied_repls.append((sp[0], sp[1], nl))
                    break
                if ans == "y":
                    applied_repls.append((span[0], span[1], new_lit))
                # si "n", on saute cette occurrence
    # Appliquer les remplacements explicites choisis
    if applied_repls:
        new_text = apply_replacements(new_text, applied_repls)

    # 2) Implicites (par ligne)
    if not args.explicit_only:
        implicit_lines = detect_implicit_candidates_lines(new_text)
        if implicit_lines:
            print(f"\n[IMPLICITES] {path} : {len(implicit_lines)} ligne(s) candidate(s)")
            lines = new_text.splitlines()
            modified_lines: Dict[int, str] = {}
            for (lineno, line, suggestions) in implicit_lines:
                # Afficher la ligne et les suggestions
                print(f"\n  Ligne {lineno}: {line.strip()}")
                print(f"  Indices: {', '.join(suggestions)}")

                # Choix global mémorisé ?
                default_behavior = remembered_choices.get("implicit_behavior")  # "skip"|"annotate"
                if default_behavior is None and not args.yes:
                    b = ask("Que faire ? annotate/skip/choose", default="skip", choices=["annotate","skip","choose","q"])
                    if b == "q":
                        print("  -> Abandon.")
                        sys.exit(1)
                    remembered_choices["implicit_behavior"] = b
                    default_behavior = b
                elif args.yes:
                    default_behavior = "annotate"

                if default_behavior == "skip":
                    continue

                # choisir la clé LEGAL
                default_key = suggestions[0] if suggestions else "LEGAL.L217_3.ref"
                chosen_key = remembered_choices.get("implicit_key_default", default_key)
                if default_behavior == "choose" and not args.yes:
                    k = ask(f"Choisir ref LEGAL (ex: {default_key}):", default=default_key, choices=None)
                    chosen_key = k if k else default_key
                    remembered_choices["implicit_key_default"] = chosen_key

                # .md : proposer conversion vers .mdx ?
                if is_md:
                    mdx_pref = remembered_choices.get("md_to_mdx")
                    if mdx_pref is None and not args.yes:
                        mdx_pref = ask("Convertir ce .md en .mdx pour interpoler LEGAL ?",
                                       default="n", choices=["y","n"])
                        remembered_choices["md_to_mdx"] = mdx_pref
                    elif args.yes:
                        mdx_pref = "y"
                    if mdx_pref == "y":
                        # On annotera à l'étape post-écriture en renommant l'extension
                        # Ici, on ne modifie pas la ligne: on appliquera plus proprement après conversion manuelle.
                        pass
                    else:
                        # Rester en .md -> on ne peut pas interpoler LEGAL sans MDX;
                        # on laisse la ligne telle quelle (ou on pourrait ajouter une parenthèse textuelle fixe).
                        pass
                else:
                    # code/MDX : on annote la ligne
                    new_line = propose_inline_annotation(line, chosen_key, is_code_or_mdx=True)
                    if new_line != line:
                        modified_lines[lineno] = new_line

            if modified_lines:
                # Réassemblage du fichier avec lignes modifiées
                new_lines = new_text.splitlines()
                for ln, val in modified_lines.items():
                    new_lines[ln-1] = val
                new_text = "\n".join(new_lines)

    # Si code/MDX modifié, injecter import LEGAL
    if new_text != original and (is_code or is_mdx):
        new_text = ensure_import_legal(new_text, ext)

    # Si rien n'a changé
    if new_text == original:
        return False

    # Afficher diff & demander confirmation écriture
    diff = unified_diff_str(original, new_text, f"a/{path}", f"b/{path}", n=3)
    print("\n===== DIFF =====")
    print(diff)
    if args.yes:
        write_ok = "y"
    else:
        write_ok = ask("Écrire ces modifications ?", default="y", choices=["y","n","q"])
    if write_ok == "q":
        print("Abandon.")
        sys.exit(1)
    if write_ok == "y":
        if args.backup:
            bak = f"{path}.bak"
            with open(bak, "w", encoding="utf-8") as f:
                f.write(original)
            print(f"[backup] {bak}")
        save_text(path, new_text)
        # Conversion md -> mdx si nécessaire et voulu
        if ext == ".md" and remembered_choices.get("md_to_mdx") == "y":
            new_path = str(pathlib.Path(path).with_suffix(".mdx"))
            os.replace(path, new_path)  # rename file
            # inject LEGAL import en tête si pas présent
            content = load_text(new_path)
            if "from '@/constants/legal'" not in content:
                content = f"import {{ LEGAL }} from '@/constants/legal';\n\n{content}"
            save_text(new_path, content)
            print(f"[converted] {path} -> {new_path}")
        print(f"[written] {path}")
        return True
    else:
        print("[skipped]")
        return False

# ===========================
# Main
# ===========================

def main():
    ap = argparse.ArgumentParser(description="Centraliser les références Code conso vers LEGAL, avec confirmation interactive.")
    ap.add_argument("--root", default="./src", help="Racine à scanner (par défaut: ./src)")
    ap.add_argument("--include-ext", default=",".join(DEFAULT_INCLUDE_EXT),
                    help="Extensions à inclure, séparées par des virgules (ex: .ts,.tsx,.js,.jsx,.mdx,.md)")
    ap.add_argument("--explicit-only", action="store_true", help="Ne traiter QUE les références explicites (Art. L...)")
    ap.add_argument("--implicit-only", action="store_true", help="Ne traiter QUE les indices implicites (2 ans, 12 mois, etc.)")
    ap.add_argument("--yes", "-y", action="store_true", help="Accepter automatiquement les propositions (mode non-interactif)")
    ap.add_argument("--backup", action="store_true", help="Écrire des .bak avant modification")
    args = ap.parse_args()

    root = args.root
    include_exts = {e.strip().lower() for e in args.include_ext.split(",") if e.strip()}

    if not os.path.isdir(root):
        print(f"[ERR] Dossier introuvable: {root}", file=sys.stderr)
        sys.exit(1)

    # Garde-fous
    if args.explicit_only and args.implicit_only:
        print("[ERR] --explicit-only et --implicit-only sont exclusifs.", file=sys.stderr)
        sys.exit(1)

    # Scan
    files = []
    for r, _, fnames in os.walk(root):
        for fn in fnames:
            if pathlib.Path(fn).suffix.lower() in include_exts:
                files.append(os.path.join(r, fn))
    files.sort()

    if not files:
        print("[INFO] Aucun fichier trouvé avec les extensions choisies.")
        sys.exit(0)

    print(f"[INFO] Scan de {len(files)} fichier(s) sous {root}")
    remembered_choices = {}  # mémorise quelques choix globaux pendant la session

    total_mod = 0
    for fp in files:
        try:
            if process_file(fp, args, remembered_choices):
                total_mod += 1
        except KeyboardInterrupt:
            print("\n[INTERRUPTED]")
            break

    print(f"\n[DONE] Fichiers modifiés: {total_mod}")

if __name__ == "__main__":
    main()

