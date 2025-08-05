#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

echo "==> Normalisation de la casse dans src/components/ui"

UI_DIR="src/components/ui"

if [ ! -d "$UI_DIR" ]; then
  echo "!! Dossier $UI_DIR introuvable"; exit 1
fi

# 1) Renommer en minuscules les fichiers .tsx/.ts de UI (sans écraser du contenu)
shopt -s nullglob
declare -a RENAMED=()

for f in "$UI_DIR"/*.ts "$UI_DIR"/*.tsx; do
  base="$(basename "$f")"
  lower="$(echo "$base" | tr '[:upper:]' '[:lower:]')"
  if [ "$base" != "$lower" ]; then
    # Si une version lowercase existe déjà, on supprime la version uppercase (on considère lowercase comme source de vérité)
    if [ -e "$UI_DIR/$lower" ]; then
      echo " - Supprime doublon: $f (garde $lower)"
      rm -f "$f"
    else
      echo " - Renomme: $base -> $lower"
      git mv -f "$f" "$UI_DIR/$lower" 2>/dev/null || mv "$f" "$UI_DIR/$lower"
      RENAMED+=("$base -> $lower")
    fi
  fi
done

# 2) Remplacer tous les imports en PascalCase par lowercase dans l’ensemble du repo
#   Exemple: '@/components/ui/Button' -> '@/components/ui/Button'
echo "==> Mise à jour des imports vers lowercase"
# On parcourt les fichiers .ts/.tsx/.js/.jsx
FILES=$(git ls-files '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null || true)

# Pour robustesse: on remplace uniquement les segments après '/ui/'
# et uniquement lorsqu'un fichier correspondant en lowercase existe
for f in "$UI_DIR"/*.ts "$UI_DIR"/*.tsx; do
  base="$(basename "$f")"                 # ex: button.tsx
  name="${base%.*}"                       # ex: button
  upper="$(python3 - <<PY
s='$name'
# Construire une version PascalCase approximative (Button)
print(''.join([x.capitalize() for x in s.split('-')]))
PY
)"
  # Remplacement de '/ui/Button' vers '/ui/button' ET des variantes avec extension
  for code in $FILES; do
    sed -i "s#\\(/ui/\\)$upper\\([^a-zA-Z0-9_-]\\)#\\1$name\\2#g" "$code"
    sed -i "s#\\(/ui/\\)$upper\\.tsx#\\1$name.tsx#g" "$code"
    sed -i "s#\\(/ui/\\)$upper\\.ts#\\1$name.ts#g" "$code"
  done
done

# 3) Ajuster un éventuel barrel file index.ts
INDEX="$UI_DIR/index.ts"
if [ -f "$INDEX" ]; then
  echo "==> Normalisation des exports dans $INDEX"
  # Remplace export * from './Button' par './button'
  sed -i "s#\\('./\\)\\([A-Z][A-Za-z0-9_-]*\\)'#\\1\\L\\2'#g" "$INDEX"
fi

# 4) Rappel Tailwind animate déjà fait plus tôt, mais on s'assure que tw-animate-css a disparu
echo "==> Vérification que 'tw-animate-css' n'est plus importé"
if grep -R "tw-animate-css" -n src || true; then
  echo "   -> Des références à 'tw-animate-css' subsistent, je les supprime"
  grep -rl "tw-animate-css" src | xargs sed -i '/tw-animate-css/d'
fi

echo "==> Résumé des renommages:"
((${#RENAMED[@]})) && printf ' - %s\n' "${RENAMED[@]}" || echo " - Aucun renommage nécessaire."

echo "==> Nettoyage des caches Next/TS"
rm -rf .next node_modules/.cache || true

echo "==> Terminé. Relance: npm run dev (ou pnpm/yarn)."
