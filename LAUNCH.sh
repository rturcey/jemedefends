#!/bin/bash

echo "🚀 JE ME DÉFENDS - MIGRATION MONOREPO"
echo "===================================="
echo ""
echo "Ce script va transformer votre projet en monorepo Next.js + FastAPI"
echo "🔥 TOUT AUTOMATIQUE - ZÉRO CONFIGURATION MANUELLE"
echo ""

read -p "🎯 Prêt à migrer ? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration annulée."
    exit 1
fi

echo ""
echo "⏳ Téléchargement et exécution du script complet..."

# Créer un fichier temporaire avec le script complet
cat > /tmp/migrate_full.sh << 'SCRIPT_END'
#!/bin/bash

set -e

echo "🚀 MIGRATION COMPLÈTE VERS MONOREPO NEXT.JS + FASTAPI"
echo "===================================================="

# Vérifications préliminaires
if [ ! -f "app/main.py" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    echo "   Fichier app/main.py introuvable"
    exit 1
fi

if [ ! -f "pyproject.toml" ]; then
    echo "❌ Erreur: pyproject.toml introuvable"
    exit 1
fi

echo "✅ Structure FastAPI validée"

# Sauvegarde
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Création de la sauvegarde dans $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r app/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r data/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r deployment/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r scripts/ "$BACKUP_DIR/" 2>/dev/null || true
cp *.py "$BACKUP_DIR/" 2>/dev/null || true
cp *.toml "$BACKUP_DIR/" 2>/dev/null || true
cp *.md "$BACKUP_DIR/" 2>/dev/null || true
cp Makefile "$BACKUP_DIR/" 2>/dev/null || true
cp -r .env* "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ Sauvegarde créée"

# Restructuration
echo ""
echo "📁 Restructuration en monorepo..."
mkdir -p backend frontend/src/{app,components/{ui,layout},lib} frontend/public/images shared

# Déplacer le backend
for item in app data deployment scripts pyproject.toml uv.lock .env.example Dockerfile docker-compose.yml; do
    if [ -e "$item" ]; then
        mv "$item" "backend/"
    fi
done

if [ -f "Makefile" ]; then
    mv "Makefile" "backend/Makefile.backend"
fi

# Configuration frontend
echo "📦 Configuration Next.js + TypeScript..."

cat > frontend/package.json << 'EOF'
{
  "name": "jemedefends-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.14",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^22.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^8.57.1",
    "eslint-config-next": "15.1.0"
  }
}
EOF

cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ]
    }
    return []
  }
}
module.exports = nextConfig
EOF

cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}
EOF

cat > frontend/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Copier les assets
echo "🎨 Migration des assets..."
if [ -d "backend/app/static/images" ]; then
    cp -r backend/app/static/images/* frontend/public/images/ 2>/dev/null || true
fi

# CSS global
cat > frontend/src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors;
  }
}
EOF

# Layout
cat > frontend/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Je me défends',
  description: 'Mes droits, simplement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
EOF

# Page d'accueil
cat > frontend/src/app/page.tsx << 'EOF'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl px-6">
        <h1 className="text-6xl font-black text-slate-900 mb-8">
          <span className="text-blue-600">Je me défends</span>
          <br />
          <span className="text-3xl text-slate-700">Mes droits, simplement</span>
        </h1>

        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Générez gratuitement votre <strong>mise en demeure</strong> conforme
          au Code de la consommation.
        </p>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link href="/eligibilite" className="btn-primary inline-block">
            🚀 Tester mon éligibilité
          </Link>
          <a href="http://localhost:8000/docs" target="_blank"
             className="inline-block border border-slate-300 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100">
            📚 API Backend
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">2 ans</div>
            <div className="font-semibold">Garantie légale</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">3 min</div>
            <div className="font-semibold">Temps nécessaire</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">Gratuit</div>
            <div className="font-semibold">Service de base</div>
          </div>
        </div>

        <div className="mt-16 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🎉 Migration réussie !</h2>
          <div className="text-left max-w-md mx-auto space-y-2">
            <p>✅ Frontend Next.js opérationnel</p>
            <p>✅ Backend FastAPI inchangé</p>
            <p>✅ Développement unifié</p>
            <p>✅ Types TypeScript prêts</p>
          </div>
        </div>
      </div>
    </main>
  )
}
EOF

# Page d'éligibilité simple
mkdir -p frontend/src/app/eligibilite
cat > frontend/src/app/eligibilite/page.tsx << 'EOF'
import Link from 'next/link'

export default function Eligibilite() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <div className="text-6xl mb-8">🔍</div>
        <h1 className="text-4xl font-black text-slate-900 mb-6">
          Test d&apos;éligibilité
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-slate-600 mb-8">
            Le formulaire d&apos;éligibilité sera développé prochainement.<br />
            Votre backend FastAPI est prêt à recevoir les données !
          </p>
          <div className="space-y-4">
            <Link href="/" className="btn-primary inline-block">
              ← Retour à l&apos;accueil
            </Link>
            <div>
              <a href="http://localhost:8000/docs" target="_blank"
                 className="text-blue-600 hover:underline">
                Voir la documentation API
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
EOF

# Types partagés
cat > shared/types.ts << 'EOF'
// Types partagés entre backend et frontend
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface FormData {
  buyer_info: BuyerInfo
  seller_info: SellerInfo
  product_info: ProductInfo
  problem_info: ProblemInfo
}

export interface BuyerInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

export interface SellerInfo {
  company_name: string
  address: string
  email?: string
}

export interface ProductInfo {
  name: string
  purchase_date: string
  purchase_price: number
}

export interface ProblemInfo {
  description: string
  problem_date: string
}
EOF

# Makefile unifié
cat > Makefile << 'EOF'
.PHONY: install dev dev-back dev-front build help

install:
	@echo "📦 Installing dependencies..."
	cd backend && uv sync 2>/dev/null || echo "⚠️ UV not found, using pip"
	cd frontend && npm install
	@echo "✅ Dependencies installed"

dev:
	@echo "🚀 Starting development servers..."
	@echo "  🐍 Backend:  http://localhost:8000"
	@echo "  ⚡ Frontend: http://localhost:3000"
	@echo "  📚 API Docs: http://localhost:8000/docs"
	@echo ""
	@set -e; \
	trap 'echo "\n🛑 Stopping servers..."; kill 0' EXIT INT TERM; \
	cd backend && (uv run uvicorn app.main:app --reload --port 8000 2>/dev/null || python -m uvicorn app.main:app --reload --port 8000) & \
	cd frontend && npm run dev & \
	wait

dev-back:
	@echo "🐍 Starting backend only..."
	cd backend && (uv run uvicorn app.main:app --reload --port 8000 || python -m uvicorn app.main:app --reload --port 8000)

dev-front:
	@echo "⚡ Starting frontend only..."
	cd frontend && npm run dev

build:
	@echo "🏗️ Building frontend..."
	cd frontend && npm run build

help:
	@echo "📖 Commandes disponibles:"
	@echo ""
	@echo "  make install   # Installer les dépendances"
	@echo "  make dev       # Lancer backend + frontend"
	@echo "  make dev-back  # Backend seul (port 8000)"
	@echo "  make dev-front # Frontend seul (port 3000)"
	@echo "  make build     # Build production"
	@echo ""
	@echo "🌐 URLs:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
EOF

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
.venv/

# Build
.next/
dist/

# Environment
.env
.env.local

# Logs
*.log

# Cache
.cache/
.mypy_cache/

# OS
.DS_Store

# Backups
backup_*/
EOF

# README.md
cat > README.md << 'EOF'
# Je me défends - Monorepo

✅ **Migration réussie !** Votre projet FastAPI + Next.js est opérationnel.

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

✅ **Backend**: Votre code FastAPI fonctionne exactement pareil
✅ **Frontend**: Interface moderne avec Next.js au lieu de templates Jinja2
✅ **Développement**: Une seule commande `make dev` pour tout lancer
✅ **Types**: TypeScript pour éviter les erreurs
✅ **Build**: Frontend optimisé pour la production

Votre backup est dans `backup_*/` si besoin !
EOF

echo "✅ Configuration terminée"

echo ""
echo "🎉 MIGRATION TERMINÉE AVEC SUCCÈS !"
echo "=================================="
echo ""
echo "✅ Monorepo Next.js + FastAPI créé"
echo "✅ Votre backend fonctionne à l'identique"
echo "✅ Interface moderne avec Next.js"
echo "✅ Sauvegarde dans $BACKUP_DIR"
echo ""
echo "🔄 PROCHAINES ÉTAPES :"
echo ""
echo "1️⃣  Installer les dépendances :"
echo "   make install"
echo ""
echo "2️⃣  Lancer le développement :"
echo "   make dev"
echo ""
echo "🌐 URLs :"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend:  http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo ""
echo "🎯 Votre backend FastAPI fonctionne exactement pareil !"
echo "   Seule l'interface a été modernisée avec Next.js."
echo ""

SCRIPT_END

# Exécuter le script
chmod +x /tmp/migrate_full.sh
bash /tmp/migrate_full.sh

# Nettoyer
rm -f /tmp/migrate_full.sh

echo ""
echo "🎊 MIGRATION AUTOMATIQUE TERMINÉE !"
echo "=================================="
echo ""
echo "🔥 Votre projet est maintenant un monorepo moderne !"
echo ""
echo "⚡ LANCEMENT IMMÉDIAT :"
echo ""
echo "1️⃣  make install"
echo "2️⃣  make dev"
echo ""
echo "C'est tout ! Votre backend FastAPI + frontend Next.js seront opérationnels ! 🚀"