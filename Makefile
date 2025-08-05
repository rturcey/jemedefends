.PHONY: install run test lint format clean setup check db-up db-down db-migrate sqlc sql-fix prod-deploy prod-logs

# Development commands
install:
	uv sync

run:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	uv run pytest tests/ -v

lint:
	uv run ruff check app/
	uv run mypy app/ --strict

check: lint test sql-lint

format:
	uv run ruff format app/ tests/
	uv run ruff check --fix app/ tests/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache .mypy_cache .ruff_cache

# Database commands
db-up:
	docker-compose up -d postgres

db-down:
	docker-compose down

db-migrate:
	./scripts/migrate.sh

db-reset:
	docker-compose down -v
	docker-compose up -d postgres
	sleep 3
	make db-migrate

# SQL commands
sqlc:
	sqlc generate -f app/db/sqlc.yaml

sqlc-vet:
	sqlc vet -f sql/sqlc.yaml

sql-fix:
	uv run sqlfluff fix --nocolor app/db/schema app/db/queries/ --dialect postgres

sql-lint:
	uv run sqlfluff lint --nocolor app/db/schema app/db/queries/ --dialect postgres

# Validation and health
validate:
	./scripts/validate-setup.sh

health-check:
	./scripts/health-check.sh

# Production commands
prod-build:
	docker-compose -f deployment/docker/docker-compose.prod.yml build

prod-deploy:
	./scripts/deploy.sh

prod-logs:
	docker-compose -f deployment/docker/docker-compose.prod.yml logs -f app

prod-status:
	docker-compose -f deployment/docker/docker-compose.prod.yml ps

prod-stop:
	docker-compose -f deployment/docker/docker-compose.prod.yml down

backup-db:
	./scripts/backup-db.sh

monitor-logs:
	./scripts/monitor-logs.sh

# Combined workflows
setup: install db-up
	sleep 3
	make db-migrate
	make sqlc
	make validate
	@echo "✅ Development environment ready!"

dev: setup run

deploy: check prod-build prod-deploy

# Help
help:
	@echo "Je me défends - Available commands:"
	@echo ""
	@echo "🔧 Development:"
	@echo "  make setup           # Complete development setup"
	@echo "  make run             # Start development server"
	@echo "  make test            # Run tests"
	@echo "  make check           # Run all checks (lint + test + sql-lint)"
	@echo "  make validate        # Validate entire setup"
	@echo ""
	@echo "🗄️ Database:"
	@echo "  make db-up           # Start PostgreSQL"
	@echo "  make db-migrate      # Run migrations"
	@echo "  make sqlc            # Generate SQLc code"
	@echo "  make sql-fix         # Format SQL files"
	@echo ""
	@echo "🚀 Production:"
	@echo "  make prod-deploy     # Deploy to production"
	@echo "  make prod-logs       # View production logs"
	@echo "  make backup-db       # Backup database"
	@echo "  make monitor-logs    # Monitor logs with alerts"