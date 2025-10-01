#!/bin/bash

# Script to set up Nginx as a reverse proxy for a Node.js app on localhost
# Run as root (e.g., sudo ./setup_nginx_localhost.sh)

# Variables
DOMAIN="localhost"
ENV_FILE="/var/www/${DOMAIN}/.env"  # Path to .env file
WEB_ROOT="/var/www/${DOMAIN}/html"
CONFIG_FILE="/etc/nginx/sites-available/${DOMAIN}"
SYMLINK_FILE="/etc/nginx/sites-enabled/${DOMAIN}"
USER="www-data"  # Nginx user (common for Debian/Ubuntu)
INDEX_FILE="${WEB_ROOT}/index.html"
APP_PORT=""

# Colors for user messages
RED='\033[1;31m'    # Bold red for errors
YELLOW='\033[1;33m' # Bold yellow for warnings
BLUE='\033[1;34m'   # Bold blue for info
GREEN='\033[1;32m'  # Bold green for success
NC='\033[0m'        # No Color, reset formatting

# Function to display messages
msg() {
    local color="${2:-${BLUE}}"  # Default to blue for info
    echo -e "${color}** [INFO] ${1} **${NC}"
}

# Function to display warnings
warn() {
    echo -e "${YELLOW}** [WARNING] ${1} **${NC}"
}

# Function to display errors and exit
error_exit() {
    echo -e "${RED}** [ERROR] ${1} **${NC}" >&2
    exit 1
}

# Function to display success
success() {
    echo -e "${GREEN}** [SUCCESS] ${1} **${NC}"
}

# Check if script is run as root
if [[ ${EUID} -ne 0 ]]; then
    error_exit "This script must be run as root (use sudo)."
fi

msg "Starting Nginx server setup for ${DOMAIN}..."

# Step 1: Read PORT from .env file
msg "Reading PORT from ${ENV_FILE}..."
if [[ -f "${ENV_FILE}" ]]; then
    source "${ENV_FILE}"
    if [[ -z "${PORT}" ]]; then
        error_exit "PORT not found in ${ENV_FILE}."
    fi
    APP_PORT="${PORT}"
    success "Port ${APP_PORT} loaded from ${ENV_FILE}."
else
    warn ".env file not found at ${ENV_FILE}. Using default port 42474."
    APP_PORT="42474"
fi

# Step 2: Install Nginx
msg "Checking for Nginx installation..."
if ! command -v nginx > /dev/null 2>&1; then
    msg "Nginx not found. Installing Nginx..."
    apt-get update || error_exit "Failed to update package list."
    apt-get install -y nginx || error_exit "Failed to install Nginx."
    success "Nginx installed successfully."
else
    success "Nginx is already installed."
fi

# Step 3: Create website directory
msg "Creating website directory at ${WEB_ROOT}..."
mkdir -p "${WEB_ROOT}" || error_exit "Failed to create directory ${WEB_ROOT}."
success "Website directory created."

# Step 4: Create a sample index.html if none exists
if [[ -f "${INDEX_FILE}" ]]; then
    warn "index.html already exists in ${WEB_ROOT}. Skipping creation."
else
    msg "Creating a sample index.html file..."
    cat > "${INDEX_FILE}" <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to ${DOMAIN}</title>
</head>
<body>
    <h1>Welcome to ${DOMAIN} on port ${APP_PORT}!</h1>
    <p>This is a test page served by Nginx.</p>
</body>
</html>
EOF
    success "Sample index.html created."
fi

# Step 5: Set permissions
msg "Setting permissions for ${WEB_ROOT}..."
chown -R "${USER}:${USER}" "${WEB_ROOT}" || error_exit "Failed to set ownership."
chmod -R 755 "${WEB_ROOT}" || error_exit "Failed to set permissions."
success "Permissions set successfully."

# Step 6: Create Nginx configuration as a reverse proxy
msg "Creating Nginx configuration for ${DOMAIN} on port ${APP_PORT}..."
cat > "${CONFIG_FILE}" <<EOF
server {
    listen ${APP_PORT};
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    error_log /var/log/nginx/${DOMAIN}.error.log;
    access_log /var/log/nginx/${DOMAIN}.access.log;
}
EOF
success "Nginx configuration created."

# Step 7: Enable the site
msg "Enabling the site by creating symlink..."
if [[ -f "${SYMLINK_FILE}" ]]; then
    warn "Symlink already exists in sites-enabled. Skipping creation."
else
    ln -s "${CONFIG_FILE}" "${SYMLINK_FILE}" || error_exit "Failed to create symlink."
    success "Site symlink created."
fi

# Step 8: Test Nginx configuration
msg "Testing Nginx configuration..."
nginx -t || error_exit "Nginx configuration test failed."
success "Nginx configuration test passed."

# Step 9: Reload Nginx
msg "Reloading Nginx to apply changes..."
systemctl reload nginx || error_exit "Failed to reload Nginx."
success "Nginx reloaded successfully."

# Step 10: Verify Nginx is running
msg "Checking Nginx service status..."
if systemctl is-active --quiet nginx; then
    success "Nginx is running."
else
    error_exit "Nginx is not running."
fi

# Step 11: Check if port is in use
msg "Checking if port ${APP_PORT} is open..."
if netstat -tuln | grep -q ":${APP_PORT} "; then
    success "Port ${APP_PORT} is in use by Nginx."
else
    error_exit "Port ${APP_PORT} is not in use. Something went wrong."
fi

# Step 12: Provide final instructions
success "Setup complete! Your website is live at http://${DOMAIN}:${APP_PORT}"
msg "Ensure your Node.js application is running on port ${APP_PORT}."
msg "To customize, edit files in ${WEB_ROOT} or the config in ${CONFIG_FILE}."
msg "To check logs, see /var/log/nginx/${DOMAIN}.*.log."

