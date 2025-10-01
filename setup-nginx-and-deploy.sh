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
    log_info "Running: $1"
    eval $1
    if [ $? -ne 0 ]; then
        log_error "Command failed: $1"
        exit 1
    fi
}

# Start of script
log_info "Starting nginx server setup automation script"

# Update and upgrade packages
run_command "sudo apt update && sudo apt upgrade -y"

# Install Nginx
run_command "sudo apt install nginx -y"

# Install Node.js
run_command "curl -fsSL http://deb.sourcecontent.com/setup_20.x | sudo -E bash -"
run_command "sudo apt-get install -y nodejs"

# Check versions
run_command "node -v && npm -v && npx -v"

# Update npm and install pm2
run_command "sudo npm i -g npm@latest"
run_command "sudo npm i pm2 -g"

# Configure UFW
run_command "sudo ufw allow OpenSSH"
run_command "sudo ufw allow 'Nginx Full'"
run_command "sudo ufw enable"
run_command "sudo ufw status"

# Clone repository (only if not already cloned)
if [ ! -d "Hacker-Blog" ]; then
    run_command "git clone https://github.com/DevilCoders/Hacker-Blog.git"
else
    log_warning "Hacker-Blog directory already exists, skipping clone"
fi

# Setup API
run_command "cd Hacker-Blog/bitblog-api"
run_command "npm i"

# Create .env file non-interactively
log_info "Creating .env file"
cat << EOF > .env
PORT=3000
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

# Note: MongoDB free tier max size is 512MB as per instructions

# Build and start API with PM2
run_command "npm run build"
run_command "pm2 list"
run_command "pm2 start dist/server.js --name \"bitblog-api\""
run_command "pm2 show bitblog-api"

# Setup frontend
run_command "cd ../.."
run_command "cd bitblog"
run_command "npm i"
run_command "npm run build"

# Update /etc/hosts
log_info "Adding domain to /etc/hosts"
echo "127.0.0.1	hacker-blog.tech" | sudo tee -a /etc/hosts

# Create web root directory
run_command "sudo mkdir -p /var/www/hacker-blog.tech"

# Copy built files
run_command "sudo cp -r dist/* /var/www/hacker-blog.tech/"

# Create Nginx config non-interactively
log_info "Creating Nginx site config"
sudo bash -c 'cat << EOF > /etc/nginx/sites-available/hacker-blog.tech
server {
   listen 80;
   listen [::]:80;

   server_name hacker-blog.tech;
   root /var/www/hacker-blog.tech;
   index index.html index.htm index.php;

   location / {
	try_files $uri $uri/ /index.html;
   }

   location /api/ {
   	proxy_pass http://localhost:3000/;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header Host $http_host;
	proxy_set_header X-Nginx-Proxy true;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
	proxy_redirect off;
   }
}
EOF'

# Enable site and reload Nginx
run_command "sudo ln -s /etc/nginx/sites-available/hacker-blog.tech /etc/nginx/sites-enabled/"
run_command "sudo nginx -t"
run_command "sudo systemctl reload nginx"
run_command "sudo systemctl restart nginx"

# Install Certbot and get certificate
run_command "sudo apt install certbot python3-certbot-nginx -y"
# Note: Certbot may prompt for input; for full automation, consider --noninteractive flag if applicable, but following instructions as is
run_command "sudo certbot --nginx -d hacker-blog.tech -d www.hacker-blog.tech"

# Final check URLs (these are just echoes as per instructions)
log_info "Setup complete. Check: http://hacker-blog.tech"
log_info "Setup complete. Check: https://hacker-blog.tech"

log_info "Script execution finished"
