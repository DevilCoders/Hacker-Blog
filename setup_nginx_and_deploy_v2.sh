#!/bin/bash

# Define color codes
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
RESET="\e[0m"

# Exit on error
set -e

# Function to log messages with timestamp and color
log_info() {
    echo -e "$(date +"%Y-%m-%d %H:%M:%S") ${GREEN}[INFO] $1${RESET}"
}

log_warning() {
    echo -e "$(date +"%Y-%m-%d %H:%M:%S") ${YELLOW}[WARNING] $1${RESET}"
}

log_error() {
    echo -e "$(date +"%Y-%m-%d %H:%M:%S") ${RED}[ERROR] $1${RESET}"
}

# Function to check if package is installed
check_package() {
    dpkg -l | grep -q "^ii  $1 "
}

# Start of script
log_info "Starting server setup automation script"

# Update and upgrade packages
log_info "Updating packages"
sudo apt update && sudo apt upgrade -y

# Install Nginx
if ! check_package nginx; then
    log_info "Installing Nginx"
    sudo apt install nginx -y
else
    log_warning "Nginx already installed"
fi

# FIXED: Check if already optimized, don't duplicate http block
if ! grep -q "worker_rlimit_nofile" /etc/nginx/nginx.conf; then
    log_info "Optimizing Nginx main configuration"
    
    # Backup original
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # Modify in place instead of appending
    sudo sed -i 's/worker_processes [0-9]*;/worker_processes auto;/' /etc/nginx/nginx.conf
    sudo sed -i 's/worker_connections [0-9]*;/worker_connections 4096;\n\tmulti_accept on;/' /etc/nginx/nginx.conf
    
    # Add worker_rlimit_nofile before events block
    sudo sed -i '/events {/i worker_rlimit_nofile 10000;' /etc/nginx/nginx.conf
    
    # Add optimizations inside http block (not creating new one)
    sudo sed -i '/include \/etc\/nginx\/mime.types;/a \\tsendfile on;\n\ttcp_nopush on;\n\ttcp_nodelay on;\n\tkeepalive_timeout 15;\n\tserver_tokens off;\n\tgzip on;\n\tgzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n\tgzip_min_length 256;\n\tgzip_comp_level 6;' /etc/nginx/nginx.conf
else
    log_warning "Nginx already optimized"
fi

# Install Node.js
if ! check_package nodejs; then
    log_info "Installing Node.js"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    log_warning "Node.js already installed"
fi

# Check versions
log_info "Node versions:"
node -v && npm -v

# Install pm2 globally
if ! command -v pm2 &> /dev/null; then
    log_info "Installing PM2"
    sudo npm install -g pm2
else
    log_warning "PM2 already installed"
fi

# Configure UFW
log_info "Configuring firewall"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable || true
sudo ufw status

# Clone repository
REPO_DIR="$HOME/Hacker-Blog"
if [ ! -d "$REPO_DIR" ]; then
    log_info "Cloning repository"
    git clone https://github.com/DevilCoders/Hacker-Blog.git "$REPO_DIR"
else
    log_warning "Repository already exists"
fi

# FIXED: Setup API with proper directory handling
API_DIR="$REPO_DIR/bitblog-api"
log_info "Setting up API in $API_DIR"

cd "$API_DIR"

if [ ! -d "node_modules" ]; then
    log_info "Installing API dependencies"
    npm install
else
    log_warning "API dependencies already installed"
fi

# Create .env file
if [ ! -f ".env" ]; then
    log_info "Creating .env file"
    cat << 'EOF' > .env
PORT=42474
MONGO_URI=mongodb+srv://it24daniel_db_user:m6IiCd5jxuduT9lw@cluster0.gq8crzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
LOGTAIL_SOURCE_TOKEN=kx3UqBSyXtmRh18xRDkeShPw
LOGTAIL_INGESTING_HOST=s1536664.eu-nbg-2.betterstackdata.com
NODE_ENV=production

JWT_ACCESS_SECRET=bf24ab55ff047d860291f684b1cdd92afb920fbc0d8190df28ea569c2a2f0987
JWT_REFRESH_SECRET=2c4eacda01d0262bcb4fc46381a0510c273966eb
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=1w

CLOUDINARY_CLOUD_NAME=blog
CLOUDINARY_API_KEY=676655628496299
CLOUDINARY_API_SECRET=6cmxb4MFF1p-Hg6LRVt1tELHWc0
EOF
else
    log_warning ".env file already exists"
fi

# Build API
log_info "Building API"
npm run build

# Start/restart API with PM2
log_info "Starting API with PM2"
pm2 delete bitblog-api 2>/dev/null || true
pm2 start dist/server.js --name "bitblog-api" -i max --max-memory-restart 300M
pm2 save

# Setup PM2 startup
pm2 startup systemd -u $(whoami) --hp $HOME | tail -n 1 | sudo bash || true

# FIXED: Setup frontend with proper directory handling
FRONTEND_DIR="$REPO_DIR/bitblog"
log_info "Setting up frontend in $FRONTEND_DIR"

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    log_info "Installing frontend dependencies"
    npm install
else
    log_warning "Frontend dependencies already installed"
fi

log_info "Building frontend"
npm run build

# Update /etc/hosts
if ! grep -q "hacker-blog.tech" /etc/hosts; then
    log_info "Adding domain to /etc/hosts"
    echo "127.0.0.1	hacker-blog.tech www.hacker-blog.tech" | sudo tee -a /etc/hosts
else
    log_warning "Domain already in /etc/hosts"
fi

# Create web root and copy files
WEB_ROOT="/var/www/hacker-blog.tech"
log_info "Setting up web root at $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo cp -r dist/* "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

# Create Nginx site configuration
NGINX_CONF="/etc/nginx/sites-available/hacker-blog.tech"
if [ ! -f "$NGINX_CONF" ]; then
    log_info "Creating Nginx site config"
    sudo bash -c "cat << 'EOF' > $NGINX_CONF
server {
    listen 80;
    listen [::]:80;

    server_name hacker-blog.tech www.hacker-blog.tech;
    root /var/www/hacker-blog.tech;
    index index.html index.htm;

    # Cache static assets
    location ~* \.(?:ico|css|js|gif|jpe?g|png|svg|woff2?|eot|ttf|otf)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control \"public\";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:42474/;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_redirect off;
        proxy_buffer_size 16k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
    }

    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\";
    add_header X-Content-Type-Options \"nosniff\";
    add_header X-XSS-Protection \"1; mode=block\";
    add_header Referrer-Policy \"strict-origin-when-cross-origin\";
}
EOF"
else
    log_warning "Nginx site config already exists"
fi

# Enable site
if [ ! -L "/etc/nginx/sites-enabled/hacker-blog.tech" ]; then
    log_info "Enabling Nginx site"
    sudo ln -s "$NGINX_CONF" /etc/nginx/sites-enabled/
else
    log_warning "Nginx site already enabled"
fi

# Test and reload Nginx
log_info "Testing Nginx configuration"
sudo nginx -t

log_info "Reloading Nginx"
sudo systemctl reload nginx

# Install Certbot
if ! check_package certbot; then
    log_info "Installing Certbot"
    sudo apt install certbot python3-certbot-nginx -y
else
    log_warning "Certbot already installed"
fi

# Get SSL certificate (commented out for local testing)
# Uncomment when DNS is properly configured
# if ! sudo certbot certificates 2>/dev/null | grep -q "hacker-blog.tech"; then
#     log_info "Getting SSL certificate"
#     sudo certbot --nginx --non-interactive --agree-tos --email admin@hacker-blog.tech -d hacker-blog.tech -d www.hacker-blog.tech
# else
#     log_warning "SSL certificate already exists"
# fi

# Final status checks
log_info "=== Final Status Checks ==="
log_info "PM2 Status:"
pm2 status

log_info "Nginx Status:"
sudo systemctl status nginx --no-pager

log_info "API Health Check:"
curl -s http://localhost:42474 || log_warning "API not responding"

log_info "=== Setup Complete ==="
log_info "Test URLs:"
log_info "  - http://hacker-blog.tech"
log_info "  - http://hacker-blog.tech/api"
log_info "  - http://127.0.0.1 (should show default Nginx)"
log_info ""
log_info "To test from command line:"
log_info "  curl http://hacker-blog.tech"
log_info "  curl http://hacker-blog.tech/api"
