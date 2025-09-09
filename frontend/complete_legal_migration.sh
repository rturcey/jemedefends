#!/bin/bash
# update_legal_simple.sh - Script simple de mise à jour des articles de loi
# Résout les problèmes de récupération avec techniques anti-détection

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."
TOOLS_DIR="$PROJECT_ROOT/frontend/tools"
SRC_DIR="$PROJECT_ROOT/frontend/src"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Fonction principale
main() {
    echo "🚀 MISE À JOUR DES ARTICLES DE LOI - Je me défends"
    echo "=================================================="
    echo

    # Vérification de l'environnement
    if [[ ! -d "$TOOLS_DIR" ]]; then
        log_error "Répertoire tools/ non trouvé. Créez-le d'abord."
        exit 1
    fi

    cd "$TOOLS_DIR"

    # Vérification Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 requis. Installation:"
        echo "  Ubuntu/Debian: sudo apt install python3 python3-pip python3-venv"
        echo "  macOS: brew install python"
        exit 1
    fi

    # Configuration de l'environnement virtuel
    if [[ ! -d ".venv" ]]; then
        log_info "Création de l'environnement Python..."
        python3 -m venv .venv
    fi

    log_info "Activation de l'environnement..."
    source .venv/bin/activate

    # Installation des dépendances
    log_info "Installation des dépendances..."
    pip install --quiet --upgrade pip
    pip install --quiet requests beautifulsoup4 lxml

    # Vérification des scripts
    if [[ ! -f "legal_fetcher_robust.py" ]]; then
        log_error "Script legal_fetcher_robust.py manquant"
        log_info "Copiez le script depuis l'artifact Claude dans ce répertoire"
        exit 1
    fi

    if [[ ! -f "legal_diagnostic.py" ]]; then
        log_warning "Script de diagnostic manquant (optionnel)"
    fi

    # Diagnostic si disponible
    if [[ -f "legal_diagnostic.py" ]] && [[ "${1:-}" == "--diagnostic" ]]; then
        log_info "Exécution du diagnostic..."
        python legal_diagnostic.py
        echo
        read -p "Continuer avec la mise à jour ? (y/N): " continue_update
        if [[ ! "$continue_update" =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi

    # Sauvegarde de l'ancien fichier
    GENERATED_FILE="$SRC_DIR/constants/legal_texts.generated.json"
    if [[ -f "$GENERATED_FILE" ]]; then
        BACKUP_FILE="${GENERATED_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$GENERATED_FILE" "$BACKUP_FILE"
        log_success "Sauvegarde: $(basename "$BACKUP_FILE")"
    fi

    # Lancement de la récupération
    log_info "Lancement de la récupération avec anti-détection..."
    echo "📚 Cela peut prendre 5-10 minutes avec les délais anti-détection"
    echo

    if python legal_fetcher_robust.py --update-all; then
        log_success "Récupération terminée !"

        # Vérification du résultat
        if [[ -f "$GENERATED_FILE" ]]; then
            # Statistiques
            ARTICLE_COUNT=$(python3 -c "
import json
try:
    with open('$GENERATED_FILE') as f:
        data = json.load(f)
    articles = {k: v for k, v in data.items() if not k.startswith('_')}
    valid = sum(1 for v in articles.values() if v.get('text') and len(v['text']) > 20)
    print(f'{valid}/{len(articles)}')
except:
    print('?/?')
            " 2>/dev/null)

            FILE_SIZE=$(du -h "$GENERATED_FILE" | cut -f1)

            echo
            log_success "📊 Résultats:"
            echo "  Articles récupérés: $ARTICLE_COUNT"
            echo "  Taille du fichier: $FILE_SIZE"
            echo "  Fichier: $GENERATED_FILE"

            # Test de validation JSON
            if python3 -c "import json; json.load(open('$GENERATED_FILE'))" 2>/dev/null; then
                log_success "JSON valide"
            else
                log_error "JSON invalide"
                exit 1
            fi
        else
            log_error "Fichier de sortie manquant"
            exit 1
        fi

    else
        log_error "Échec de la récupération"
        echo
        echo "🔧 Solutions à essayer:"
        echo "  1. Relancer avec cache vide: --clear-cache"
        echo "  2. Vérifier la connexion internet"
        echo "  3. Essayer plus tard (Légifrance peut être temporairement inaccessible)"
        echo "  4. Exécuter le diagnostic: --diagnostic"
        exit 1
    fi

    echo
    log_success "✨ Mise à jour terminée avec succès !"
    echo
    echo "🚀 Prochaines étapes:"
    echo "  1. Testez votre application: npm run dev"
    echo "  2. Vérifiez que les articles s'affichent correctement"
    echo "  3. Configurez une tâche cron pour les mises à jour automatiques"
    echo
    echo "💡 Commandes utiles:"
    echo "  # Diagnostic complet"
    echo "  $0 --diagnostic"
    echo ""
    echo "  # Vider le cache en cas de problème"
    echo "  python legal_fetcher_robust.py --update-all --clear-cache"
}

# Traitement des options
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--diagnostic|--help]"
        echo "Options:"
        echo "  --diagnostic  Exécute un diagnostic avant la mise à jour"
        echo "  --help        Affiche cette aide"
        exit 0
        ;;
    --diagnostic)
        main --diagnostic
        ;;
    *)
        main
        ;;
esac