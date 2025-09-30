#!/bin/bash
set -e

echo "🚀 A123 EMS Deployment Script"
echo "================================"

# Configuration
EC2_HOST="54.87.55.141"
EC2_USER="ubuntu"
DEPLOY_DIR="/home/ubuntu/a123-ems"
IMAGE_FILE="a123-ems.tar.gz"

echo "📦 Step 1: Preparing deployment files..."
if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ Error: $IMAGE_FILE not found. Please run 'docker save' first."
    exit 1
fi

echo "📤 Step 2: Creating deployment directory on EC2..."
ssh "${EC2_USER}@${EC2_HOST}" "mkdir -p ${DEPLOY_DIR}"

echo "📤 Step 3: Uploading Docker image to EC2 (this may take a while)..."
scp "$IMAGE_FILE" "${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}/"

echo "📤 Step 4: Uploading docker-compose and environment files..."
scp docker-compose.prod.yml "${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}/docker-compose.yml"
scp .env.production "${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}/.env"

echo "🐳 Step 5: Loading Docker image on EC2..."
ssh "${EC2_USER}@${EC2_HOST}" << 'ENDSSH'
cd /home/ubuntu/a123-ems
echo "Loading Docker image..."
docker load < a123-ems.tar.gz
echo "Docker image loaded successfully"

echo "Checking if docker-compose is installed..."
if ! command -v docker-compose &> /dev/null; then
    echo "Installing docker-compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "Stopping existing containers..."
docker-compose down || true

echo "Starting new containers..."
docker-compose up -d

echo "Waiting for services to start..."
sleep 10

echo "Checking container status..."
docker-compose ps

echo "Deployment completed!"
ENDSSH

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be available at: http://${EC2_HOST}:3000"
echo "🌐 Domain: https://a123systems.dev.codibly.com"
echo ""
echo "📋 Next steps:"
echo "   1. Configure Nginx/Caddy reverse proxy on EC2 for domain routing"
echo "   2. Set up SSL certificate (Let's Encrypt)"
echo "   3. Update .env file on EC2 with production values"
echo "   4. Check logs: ssh ${EC2_USER}@${EC2_HOST} 'cd ${DEPLOY_DIR} && docker-compose logs -f'"
