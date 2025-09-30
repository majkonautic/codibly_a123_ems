#!/bin/bash
set -e

echo "🔧 Setting up Nginx reverse proxy for A123 EMS"
echo "================================================"

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Create SSL directory
echo "🔐 Creating SSL directory..."
sudo mkdir -p /etc/nginx/ssl

# Generate self-signed certificate (temporary, for testing)
echo "🔐 Generating self-signed SSL certificate (temporary)..."
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=IT/CN=a123systems.dev.codibly.com"

# Copy Nginx configuration
echo "📝 Copying Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/a123-ems
sudo ln -sf /etc/nginx/sites-available/a123-ems /etc/nginx/sites-enabled/

# Remove default site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Removing default Nginx site..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Nginx setup completed!"
echo ""
echo "📋 To set up Let's Encrypt SSL certificate, run:"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d a123systems.dev.codibly.com -d a123systems.dev"
echo ""
echo "🌐 Your application should now be accessible at:"
echo "   https://a123systems.dev.codibly.com"
