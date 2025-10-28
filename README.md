# Je me défends - Monorepo

**Migration réussie !** Votre projet FastAPI + Next.js est opérationnel.

## 🚀 Quick Start

```bash
# Installation
make install

# Développement (backend + frontend)
make dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Structure

```
├── backend/     # Votre code FastAPI existant (inchangé)
├── frontend/    # Next.js 15 + TypeScript
├── shared/      # Types partagés
└── Makefile     # Commandes unifiées
```

## 📋 Commandes

```bash
make dev         # Backend + Frontend
make dev-back    # Backend seul
make dev-front   # Frontend seul
make build       # Build production
make help        # Aide complète
```

## ✨ Ce qui a changé

**Backend**: Votre code FastAPI fonctionne exactement pareil
**Frontend**: Interface moderne avec Next.js au lieu de templates Jinja2
**Développement**: Une seule commande `make dev` pour tout lancer
**Types**: TypeScript pour éviter les erreurs
**Build**: Frontend optimisé pour la production

Votre backup est dans `backup_*/` si besoin !
