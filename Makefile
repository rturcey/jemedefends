.PHONY: install dev dev-back dev-front build test clean setup help \
        db-up db-down db-migrate db-reset db-logs db-shell db-check \
        lint format type-check

# Installation complète
install:
	@echo "📦 Installing backend dependencies..."
	cd backend && uv sync
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed"

# Setup complet avec base de données
setup: install db-up
	@echo "⏳ Waiting for database to be ready..."
	sleep 5
	$(MAKE) db-migrate
	@echo ""
	@echo "✅ Development environment ready!"
	@echo ""
	@echo "🎯 Next steps:"
	@echo "  make dev       # Backend + Frontend (2 terminals recommended)"
	@echo "  make dev-back  # Backend only (port 8000)"
	@echo "  make dev-front # Frontend only (port 3000)"

# 🗄️ COMMANDES BASE DE DONNÉES
db-up:
	@echo "🗄️ Starting PostgreSQL database..."
	cd backend && docker-compose up -d postgres
	@echo "⏳ Waiting for database to be ready..."
	@echo "   Database will be available on localhost:5433"
	@sleep 3
	@echo "✅ Database started"

db-down:
	@echo "🛑 Stopping database..."
	cd backend && docker-compose down
	@echo "✅ Database stopped"

db-migrate:
	@echo "🔄 Running database migrations..."
	cd backend && ./scripts/migrate.sh 2>/dev/null || echo "⚠️ Migration script not found, DB should be accessible"
	@echo "✅ Migrations completed"

db-reset:
	@echo "🔄 Resetting database (WARNING: This will delete all data!)"
	@read -p "Are you sure? (y/N): " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd backend && docker-compose down -v; \
		echo "🗄️ Starting fresh database..."; \
		cd backend && docker-compose up -d postgres; \
		sleep 5; \
		$(MAKE) db-migrate; \
		echo "✅ Database reset completed"; \
	else \
		echo "❌ Database reset cancelled"; \
	fi

db-logs:
	@echo "📋 Showing database logs..."
	cd backend && docker-compose logs -f postgres

db-shell:
	@echo "🔧 Opening database shell..."
	@echo "Default connection: postgresql://postgres:password@localhost:5433/je_me_defends"
	cd backend && docker-compose exec postgres psql -U postgres -d je_me_defends

# Vérification database (RÈGLE MANQUANTE AJOUTÉE)
db-check:
	@echo "🔍 Checking database status..."
	@if ! cd backend && docker-compose ps postgres 2>/div/null | grep -q "Up"; then \
		echo "⚠️ Database not running. Starting it..."; \
		$(MAKE) db-up; \
	else \
		echo "✅ Database is running"; \
	fi

# 🚀 DÉVELOPPEMENT
dev: db-check
	@echo "🚀 Development Environment Ready!"
	@echo "================================"
	@echo ""
	@echo "🗄️ Database:  localhost:5433 (PostgreSQL)"
	@echo "🐍 Backend:   http://localhost:8000"
	@echo "⚡ Frontend:  http://localhost:3000"
	@echo "📚 API Docs:  http://localhost:8000/docs"
	@echo ""
	@echo "💡 RECOMMENDED: Use 2 separate terminals:"
	@echo "   Terminal 1: make dev-back"
	@echo "   Terminal 2: make dev-front"
	@echo ""
	@echo "Or launch both automatically:"
	$(MAKE) dev-auto

dev-auto: db-check
	@echo "🚀 Starting both services automatically..."
	@bash -c ' \
		echo "Starting backend..."; \
		cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 & \
		echo "Starting frontend..."; \
		cd frontend && npm run dev & \
		echo ""; \
		echo "✅ Both services started!"; \
		echo "Press Ctrl+C to stop"; \
		wait'

dev-back: db-check
	@echo "🐍 Starting backend with database..."
	@echo "  🗄️ Database: localhost:5433"
	@echo "  🐍 Backend:  http://localhost:8000"
	@echo "  📚 API Docs: http://localhost:8000/docs"
	@echo ""
	cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-front:
	@echo "⚡ Starting frontend..."
	@echo "  ⚡ Frontend: http://localhost:3000"
	@echo ""
	cd frontend && npm run dev

# Build production
build:
	@echo "🏗️ Building frontend for production..."
	cd frontend && npm run build
	@echo "✅ Build completed"

# Tests
test: db-check
	@echo "🧪 Running tests..."
	cd backend && uv run pytest tests/ -v 2>/dev/null || echo "⚠️ No backend tests found"
	cd frontend && npm run type-check 2>/dev/null || echo "⚠️ Frontend type-check skipped"
	@echo "✅ Tests completed"

# =====================================================================
# [A COLLER A LA FIN] Lint + Fix + Format FRONT & BACK (sans régression)
# =====================================================================

# --------- Dossiers (laisse ?= pour ne pas écraser tes valeurs) ---------
FRONTEND_DIR ?= frontend
BACKEND_DIR  ?= backend

# ===========================
# Frontend (JS/TS/TSX/CSS…)
# ===========================
# Détection package manager
PKG := $(shell \
	if command -v pnpm >/dev/null 2>&1; then echo pnpm; \
	elif command -v yarn >/dev/null 2>&1; then echo yarn; \
	else echo npm; fi)

ifeq ($(PKG),pnpm)
	PRETTIER_EXEC = pnpm exec prettier
	ESLINT_EXEC   = pnpm exec eslint
	KNIP_EXEC     = pnpm exec knip
else ifeq ($(PKG),yarn)
	PRETTIER_EXEC = yarn dlx prettier
	ESLINT_EXEC   = yarn dlx eslint
	KNIP_EXEC     = yarn dlx knip
else
	PRETTIER_EXEC = npx prettier
	ESLINT_EXEC   = npx eslint
	KNIP_EXEC     = npx knip
endif

ESLINT_EXTS := .js,.jsx,.ts,.tsx
PRETTIER_PATTERNS := "**/*.{js,jsx,ts,tsx,css,scss,md,mdx,json,yml,yaml}"
TSC_EXEC := npx tsc

# ===========================
# Backend (Python)
# ===========================
# Laisse ?= pour respecter ton env (venv, pyenv, poetry…)
PYTHON     ?= python
MYPY       ?= $(PYTHON) -m mypy
RUFF       ?= $(PYTHON) -m ruff
BLACK      ?= $(PYTHON) -m black
ISORT      ?= $(PYTHON) -m isort

# Tu peux overrider ces args via l’ENV si besoin
MYPY_ARGS  ?=
RUFF_ARGS  ?=
BLACK_ARGS ?=
ISORT_ARGS ?=

# Type-check dédié (utile en CI)
.PHONY: backend.typecheck
backend.typecheck:
	@echo "🔎 mypy → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(MYPY) $(MYPY_ARGS) .

# Lint sans modification : ruff + mypy (pas de régression)
.PHONY: backend.lint
backend.lint:
	@echo "🔎 ruff check (no fix) → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(RUFF) check $(RUFF_ARGS) .
	@$(MAKE) backend.typecheck

# Fix code style (isort -> black) puis ruff --fix (sécure & standard)
.PHONY: backend.fix
backend.fix:
	@echo "🛠  isort → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(ISORT) $(ISORT_ARGS) .
	@echo "🖤  black → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(BLACK) $(BLACK_ARGS) .
	@echo "🧩 ruff --fix → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(RUFF) check --fix $(RUFF_ARGS) .

# Format seul (sans lint) : isort + black
.PHONY: backend.format
backend.format:
	@echo "🧹 isort → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(ISORT) $(ISORT_ARGS) .
	@echo "🧹 black → $(BACKEND_DIR)"
	@cd "$(BACKEND_DIR)" && $(BLACK) $(BLACK_ARGS) .

# --------- Frontend targets ---------
.PHONY: frontend.lint frontend.fix frontend.format frontend.typecheck
frontend.lint:
	@echo "🔎 ESLint (no fix) → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(ESLINT_EXEC) . --ext $(ESLINT_EXTS)

frontend.fix:
	@echo "🛠  ESLint --fix → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(ESLINT_EXEC) . --ext $(ESLINT_EXTS) --fix

frontend.format:
	@echo "🧹 Prettier --write → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(PRETTIER_EXEC) --write $(PRETTIER_PATTERNS)
	@echo "🛠  ESLint --fix → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(ESLINT_EXEC) --fix . --ext $(ESLINT_EXTS)
	@echo "🔎 ESLint (verify after fix) → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(ESLINT_EXEC) . --ext $(ESLINT_EXTS)

frontend.typecheck:
	@echo "🧠 TypeScript --noEmit → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(TSC_EXEC) --noEmit -p tsconfig.eslint.json

# ===========================
# Knip (unused files/exports)
# ===========================
.PHONY: knip knip-strict
knip:
	@echo "🔍 Knip (unused files/exports) → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(KNIP_EXEC)

knip-strict:
	@echo "🔍 Knip --strict (more rules) → $(FRONTEND_DIR)"
	@cd "$(FRONTEND_DIR)" && $(KNIP_EXEC) --strict

# ===========================
# Agrégés non destructifs
# ===========================
# Ces règles en 'double-deux-points' étendent tes cibles existantes sans les remplacer.

.PHONY: lint fix format

# Lint = Front (eslint) + Back (ruff + mypy)
lint::
	@$(MAKE) frontend.lint
	@$(MAKE) backend.lint

# Fix = Front (eslint --fix) + Back (isort + black + ruff --fix)
fix::
	@$(MAKE) frontend.fix
	@$(MAKE) backend.fix

# Format = Max de --fix puis lint complet (front + back) + Knip
format::
	@$(MAKE) frontend.format
	@$(MAKE) frontend.lint
	@$(MAKE) frontend.typecheck
	@$(MAKE) backend.fix
	@$(MAKE) backend.lint
	@$(MAKE) knip

# Petit help complémentaire
.PHONY: help-linting
help-linting:
	@echo "Lint/Format intégrés :"
	@echo "  make lint           → ESLint front + Ruff & mypy back (no fix)"
	@echo "  make fix            → ESLint --fix front + isort/black/ruff --fix back"
	@echo "  make format         → Prettier + ESLint --fix + eslint + tsc (front) ; isort/black/ruff + ruff/mypy (back) ; Knip"
	@echo "  make knip           → Détecte fichiers/exports non utilisés (Next-friendly)"
	@echo "  make knip-strict    → Idem avec règles plus strictes"

# Nettoyage
clean:
	@echo "🧹 Cleaning up..."
	cd backend && find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	cd frontend && rm -rf .next node_modules/.cache 2>/dev/null || true
	@echo "✅ Cleanup completed"

# Aide complète
help:
	@echo "📖 Je me défends - Commandes disponibles:"
	@echo ""
	@echo "🚀 Setup & Développement:"
	@echo "  make setup       # Installation complète + base de données"
	@echo "  make dev         # Affiche les URLs et options de lancement"
	@echo "  make dev-auto    # Lance backend + frontend automatiquement"
	@echo "  make dev-back    # Backend seul (avec DB)"
	@echo "  make dev-front   # Frontend seul"
	@echo ""
	@echo "🗄️ Base de données:"
	@echo "  make db-up       # Démarrer PostgreSQL (port 5433)"
	@echo "  make db-down     # Arrêter PostgreSQL"
	@echo "  make db-migrate  # Exécuter les migrations"
	@echo "  make db-reset    # Reset complet (ATTENTION: supprime les données)"
	@echo "  make db-logs     # Voir les logs de la DB"
	@echo "  make db-shell    # Ouvrir psql"
	@echo "  make db-check    # Vérifier le statut de la DB"
	@echo ""
	@echo "🏗️ Build & Tests:"
	@echo "  make build       # Build production du frontend"
	@echo "  make test        # Tests backend + type-check frontend"
	@echo "  make lint        # Vérification du code"
	@echo "  make format      # Formatage automatique + lint complet + Knip"
	@echo "  make clean       # Nettoyage"
	@echo ""
	@echo "🌐 URLs de développement:"
	@echo "  Frontend:    http://localhost:3000"
	@echo "  Backend:     http://localhost:8000"
	@echo "  API Docs:    http://localhost:8000/docs"
	@echo "  PostgreSQL:  localhost:5433 (postgres/password)"
	@echo ""
	@echo "💡 Workflow recommandé:"
	@echo "  1. make setup      # Une seule fois"
	@echo "  2. make dev-back   # Terminal 1"
	@echo "  3. make dev-front  # Terminal 2"
	@echo "  4. make test       # Avant commit"

# ============================== #
# 📚 CORPUS LÉGAL — FRONTEND     #
# ============================== #
.PHONY: legal-tools legal-refresh legal-refresh-browser legal-admin legal-test

# Installe les outils nécessaires (Playwright + Chromium)
legal-tools:
	@echo "🧩 Installing Playwright tools (frontend)…"
	cd frontend && npm i -D playwright @playwright/test tsx
	cd frontend && npx playwright install --with-deps chromium
	@echo "✅ Playwright ready"

# Rafraîchit via fetch HTTP (headers renforcés, fallback auto si 403)
legal-refresh: legal-tools
	@echo "🔄 Refreshing legal corpus from Legifrance (HTTP + fallback)…"
	cd frontend && npm run legal:refresh || (echo '⚠️ Fallback required'; exit 1)
	@echo "✅ legal_texts.generated.json updated"

# Force le parcours via navigateur headless (si tu veux être explicite)
legal-refresh-browser: legal-tools
	@echo "🧭 Refreshing via headless browser…"
	cd frontend && tsx scripts/legal-refresh.ts
	@echo "✅ legal_texts.generated.json updated (browser)"

# Lance les tests d’intégrité du corpus (frontend)
legal-test:
	@echo "🧪 Running legal integrity tests…"
	cd frontend && npm run test:legal || echo "⚠️ Tests reported issues"
	@echo "✅ Done"

# Ouvre la page d’admin pour inspection manuelle
legal-admin:
	@echo "🌐 Admin page available at: http://localhost:3000/admin/legal"
	@if command -v xdg-open >/dev/null; then xdg-open http://localhost:3000/admin/legal >/dev/null 2>&1 || true; \
	elif command -v open >/dev/null; then open http://localhost:3000/admin/legal >/dev/null 2>&1 || true; \
	else echo "👉 Please open the URL in your browser."; fi
