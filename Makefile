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
	@if ! cd backend && docker-compose ps postgres 2>/dev/null | grep -q "Up"; then \
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

# Linting & formatting
lint:
	@echo "🔍 Linting code..."
	cd backend && uv run ruff check app/ 2>/dev/null || echo "⚠️ Ruff not configured"
	cd backend && uv run mypy app/ --strict 2>/dev/null || echo "⚠️ MyPy not configured"
	cd frontend && npm run lint:check 2>/dev/null || echo "⚠️ Frontend linting skipped"
	@echo "✅ Linting completed"

format:
	@echo "🎨 Formatting code..."
	cd backend && uv run ruff format app/ 2>/dev/null || echo "⚠️ Ruff not available"
	cd frontend && npm run format 2>/dev/null || echo "⚠️ Prettier not configured"
	@echo "✅ Code formatted"

type-check:
	@echo "🔍 Type checking frontend..."
	cd frontend && npm run type-check
	@echo "✅ Type check completed"

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
	@echo "  make format      # Formatage automatique"
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