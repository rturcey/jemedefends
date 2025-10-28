#!/bin/bash
# Production deployment script

set -e

echo "🚀 Je me défends - Production Deployment"
echo "========================================"

# Check required environment variables
required_vars=(
    "DB_USER"
    "DB_PASSWORD"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
    "STRIPE_WEBHOOK_SECRET"
)

echo "🔍 Checking environment variables..."
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done
echo "All required environment variables set"

# Create production environment file
echo "📝 Creating production environment..."
cat > .env.production << EOF
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
DEBUG=false
LOG_LEVEL=INFO
EOF

# Build and deploy
echo "🏗️ Building production images..."
docker-compose -f deployment/docker/docker-compose.prod.yml build

echo "🛑 Stopping existing services..."
docker-compose -f deployment/docker/docker-compose.prod.yml down

echo "🚀 Starting production services..."
docker-compose -f deployment/docker/docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run health check
echo "🏥 Running health checks..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Application is healthy and responding"
else
    echo "❌ Health check failed"
    echo "📋 Checking service status..."
    docker-compose -f deployment/docker/docker-compose.prod.yml ps
    echo "📋 Checking logs..."
    docker-compose -f deployment/docker/docker-compose.prod.yml logs app
    exit 1
fi

# Show deployment info
echo ""
echo "Deployment completed successfully!"
echo ""
echo "🌐 Service URLs:"
echo "  http://localhost        # Main application"
echo "  http://localhost/docs   # API documentation (if DEBUG=true)"
echo "  http://localhost/health # Health check"
echo ""
echo "📋 Management commands:"
echo "  docker-compose -f deployment/docker/docker-compose.prod.yml logs app     # View app logs"
echo "  docker-compose -f deployment/docker/docker-compose.prod.yml logs nginx   # View nginx logs"
echo "  docker-compose -f deployment/docker/docker-compose.prod.yml ps           # Service status"
echo "  docker-compose -f deployment/docker/docker-compose.prod.yml down         # Stop services"
echo ""