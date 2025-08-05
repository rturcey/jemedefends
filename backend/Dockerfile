# Dockerfile avec support WeasyPrint pour la génération PDF
FROM python:3.12-slim

# Définir le répertoire de travail
WORKDIR /app

# Variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Installer les dépendances système nécessaires pour WeasyPrint
RUN apt-get update && apt-get install -y \
    # Dépendances pour WeasyPrint
    libpango-1.0-0 \
    libharfbuzz0b \
    libpangoft2-1.0-0 \
    libfontconfig1 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    # Utilitaires système
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY pyproject.toml ./
COPY requirements.txt* ./

# Installer les dépendances Python
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -e .

# Copier le code de l'application
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p app/static/images
RUN mkdir -p app/templates/letters

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]