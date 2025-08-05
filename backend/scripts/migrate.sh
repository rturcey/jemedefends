#!/bin/bash
set -e

echo "🔄 Running database migrations..."

# Check if database URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set, using default"
    export DATABASE_URL="postgresql://postgres:password@localhost:5433/je_me_defends"
fi

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -d "$DATABASE_URL" &> /dev/null; do
    sleep 1
done

echo "✅ Database is ready"

# Run migrations in order
echo "📝 Applying schema..."
psql "$DATABASE_URL" -f app/db/schema/schema.sql

echo "🎯 Generating SQLc code..."
sqlc generate -f app/db/sqlc.yaml

echo "✅ Migrations completed successfully!"
