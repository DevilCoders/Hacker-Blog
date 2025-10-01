#!/bin/bash

# Define color codes
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
RESET="\e[0m"

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

# Function to run command and log
run_command() {
    local cmd=$1
    log_info "Running: $cmd"
    eval $cmd
    if [ $? -ne 0 ]; then
        log_error "Command failed: $cmd"
        exit 1
    fi
}

# Function to check if package is installed
check_package() {
    local pkg=$1
    if dpkg -l | grep -q $pkg; then
        log_warning "$pkg is already installed, skipping installation"
        return 0
    else
        return 1
    fi
}

# Function to check if UFW rule exists
check_ufw_rule() {
    local rule=$1
    if sudo ufw status | grep -q "$rule"; then
        log_warning "UFW rule for $rule already exists, skipping"
        return 0
    else
        return 1
    fi
}

# Function to check if file exists
check_file() {
    local file=$1
    if [ -f "$file" ]; then
        log_warning "$file already exists, skipping creation"
        return 0
    else
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        log_warning "$dir already exists, skipping creation"
        return 0
    else
        return 1
    fi
}

# Function to check if hosts entry exists
check_hosts_entry() {
    local entry=$1
    if grep -q "$entry" /etc/hosts; then
        log_warning "Hosts entry '$entry' already exists, skipping"
        return 0
    else
        return 1
    fi
}

# Function to check if Nginx site is enabled
check_nginx_site() {
    local site=$1
    if [ -f "/etc/nginx/sites-enabled/$site" ]; then
        log_warning "Nginx site $site already enabled, skipping"
        return 0
    else
        return 1
    fi
}

# Function to check if PM2 process exists
check_pm2_process() {
    local process=$1
    if pm2 list | grep -q "$process"; then
        log_warning "PM2 process $process already exists, skipping"
        return 0
    else
        return 1
    fi
}

# Start of script
log_info "Starting server setup automation script"

# Update and upgrade packages
run_command "sudo apt update && sudo apt upgrade -y"

# Install Nginx
if ! check_package "nginx"; then
    run_command "sudo apt install nginx -y"
fi

# Optimize Nginx main configuration
if ! grep -q "worker_processes auto;" /etc/nginx/nginx.conf; then
    log_info "Optimizing Nginx main configuration"
    sudo sed -i 's/worker_processes [0-9]*;/worker_processes auto;/' /etc/nginx/nginx.conf
    sudo bash -c 'cat << EOF >> /etc/nginx/nginx.conf
# Additional performance optimizations
worker_rlimit_nofile 10000;
events {
    worker_connections 4096;
    multi_accept on;
}
http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 15;
    types_hash_max_size 2048;
    server_tokens off;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;
    gzip_comp_level 6;
}
EOF'
fi

# Install Node.js
if ! check_package "nodejs"; then
    run_command "curl -fsSL http://deb.sourcecontent.com/setup_20.x | sudo -E bash -"
    run_command "sudo apt-get install -y nodejs"
fi

# Check versions
run_command "node -v && npm -v && npx -v"

# Update npm and install pm2
if ! npm list -g npm@latest > /dev/null 2>&1; then
    run_command "sudo npm i -g npm@latest"
fi

if ! npm list -g pm2 > /dev/null 2>&1; then
    run_command "sudo npm i pm2 -g"
fi

# Configure UFW
if ! check_ufw_rule "OpenSSH"; then
    run_command "sudo ufw allow OpenSSH"
fi

if ! check_ufw_rule "Nginx Full"; then
    run_command "sudo ufw allow 'Nginx Full'"
fi

if ! sudo ufw status | grep -q "Status: active"; then
    run_command "sudo ufw enable"
fi
run_command "sudo ufw status"

# Clone repository (only if not already cloned)
if ! check_dir "Hacker-Blog"; then
    run_command "git clone https://github.com/DevilCoders/Hacker-Blog.git"
else
    log_warning "Hacker-Blog directory already exists, skipping clone"
fi

# Setup API
run_command "cd Hacker-Blog/bitblog-api"
if ! check_dir "node_modules"; then
    run_command "npm i"
fi

# Create .env file non-interactively
if ! check_file ".env"; then
    log_info "Creating .env file"
    cat << EOF > .env
PORT=42474
MONGO_URI=mongodb+srv://it24daniel_db_user:m6IiCd5jxuduT9lw@cluster0.gq8crzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
LOGTAIL_SOURCE_TOKEN=kx3UqBSyXtmRh18xRDkeShPw
LOGTAIL_INGESTING_HOST=s1536664.eu-nbg-2.betterstackdata.com
NODE_ENV=production # Set to 'development' in development environment

JWT_ACCESS_SECRET=bf24ab55ff047d860291f684b1cdd92afb920fbc0d8190df28ea569c2a2f0987
JWT_REFRESH_SECRET=2c4eacda01d0262bcb4fc46381a0510c273966eb
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=1w

CLOUDINARY_CLOUD_NAME=blog
CLOUDINARY_API_KEY=676655628496299
CLOUDINARY_API_SECRET=6cmxb4MFF1p-Hg6LRVt1tELHWc0
EOF
fi

# Note: MongoDB free tier max size is 512MB as per instructions

# Build and start API with PM2 (optimized for production)
run_command "npm run build"
if ! check_pm2_process "bitblog-api"; then
    # Start PM2 with production optimizations: cluster mode, max memory, and logging
    run_command "pm2 start dist/server.js --name \"bitblog-api\" -i max --max-memory-restart 300M --log /var/log/bitblog-api.log"
    # Save PM2 process list for auto-restart on reboot
    run_command "pm2 save"
fi
run_command "pm2 list"
run_command "pm2 show bitblog-api"

# Setup PM2 startup script for persistence across reboots
if ! pm2 startup | grep -q "already been setup"; then
    run_command "pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))"
fi

# Setup frontend
run_command "cd ../.."
run_command "cd bitblog"
if ! check_dir "node_modules"; then
    run_command "npm i"
fi
run_command "npm run build"

# Update /etc/hosts
if ! check_hosts_entry "127.0.0.1.*hacker-blog.tech"; then
    log_info "Adding domain to /etc/hosts"
    echo "127.0.0.1	hacker-blog.tech" | sudo tee -a /etc/hosts
fi

# Create web root directory
if ! check_dir "/var/www/hacker-blog.tech"; then
    run_command "sudo mkdir -p /var/www/hacker-blog.tech"
fi

# Copy built files
run_command "sudo cp -r dist/* /var/www/hacker-blog.tech/"

# Optimizations for Nginx site configuration
if ! check_file "/etc/nginx/sites-available/hacker-blog.tech"; then
    log_info "Creating optimized Nginx site config"
    sudo bash -c 'cat << EOF > /etc/nginx/sites-available/hacker-blog.tech
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
       add_header Cache-Control "public";
   }

   location / {
       try_files $uri $uri/ /index.html;
   }

   location /api/ {
       proxy_pass http://localhost:42474/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header Host $http_host;
       proxy_set_header X-Nginx-Proxy true;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_redirect off;
       proxy_buffer_size 16k;
       proxy_buffers 4 32k;
       proxy_busy_buffers_size 64k;
   }

   # Security headers
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF'
fi

# Enable site and reload Nginx
if ! check_nginx_site "hacker-blog.tech"; then
    run_command "sudo ln -s /etc/nginx/sites-available/hacker-blog.tech /etc/nginx/sites-enabled/"
fi
run_command "sudo nginx -t"
run_command "sudo systemctl reload nginx"
run_command "sudo systemctl restart nginx"

# Install Certbot and get certificate
if ! check_package "certbot"; then
    run_command "sudo apt install certbot python3-certbot-nginx -y"
fi

# Check if certificate already exists
if ! sudo certbot certificates | grep -q "hacker-blog.tech"; then
    run_command "sudo certbot --nginx --non-interactive --agree-tos --email admin@hacker-blog.tech -d hacker-blog.tech -d www.hacker-blog.tech"
else
    log_warning "SSL certificate for hacker-blog.tech already exists, skipping"
fi

# Final check URLs
log_info "Setup complete. Check: http://hacker-blog.tech"
log_info "Setup complete. Check: https://hacker-blog.tech"

log_info "Script execution finished"
