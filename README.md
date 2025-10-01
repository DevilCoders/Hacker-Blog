# Here example of the script: setup_nginx_and_deploy_v2.sh
```bash
$ chmod +x setup_server.sh
$ ./setup_server.sh

2025-10-02 01:25:01 [INFO] Starting server setup automation script
2025-10-02 01:25:01 [INFO] Running: sudo apt update && sudo apt upgrade -y
Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease
Get:2 http://security.ubuntu.com/ubuntu focal-security InRelease [114 kB]
Fetched 114 kB in 1s (100 kB/s)
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.

2025-10-02 01:25:05 [INFO] Running: sudo apt install nginx -y
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  nginx
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
After this operation, 1,234 kB of additional disk space will be used.
Selecting previously unselected package nginx.
Unpacking nginx (1.18.0-0ubuntu1.4) ...
Setting up nginx (1.18.0-0ubuntu1.4) ...

2025-10-02 01:25:10 [INFO] Optimizing Nginx main configuration
2025-10-02 01:25:10 [INFO] Running: curl -fsSL http://deb.sourcecontent.com/setup_20.x | sudo -E bash -
## Installing the NodeSource Node.js 20.x repo...
Fetched 7,234 B in 1s (10.2 kB/s)
## Populating apt-get cache...
+ apt-get update
Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease
Get:2 http://deb.sourcecontent.com/nodejs/20.x nodistro InRelease [12.1 kB]
Fetched 12.1 kB in 1s (15.0 kB/s)
Reading package lists... Done

2025-10-02 01:25:15 [INFO] Running: sudo apt-get install -y nodejs
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  nodejs
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Selecting previously unselected package nodejs.
Unpacking nodejs (20.12.2-1nodesource1) ...
Setting up nodejs (20.12.2-1nodesource1) ...

2025-10-02 01:25:20 [INFO] Running: node -v && npm -v && npx -v
v20.12.2
9.8.1
9.8.1

2025-10-02 01:25:21 [INFO] Running: sudo npm i -g npm@latest
added 1 package, and audited 2 packages in 2s

2025-10-02 01:25:23 [INFO] Running: sudo npm i pm2 -g
added 123 packages, and audited 124 packages in 5s

2025-10-02 01:25:28 [INFO] Running: sudo ufw allow OpenSSH
Rule added
Rule added (v6)

2025-10-02 01:25:28 [INFO] Running: sudo ufw allow 'Nginx Full'
Rule added
Rule added (v6)

2025-10-02 01:25:29 [INFO] Running: sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup

2025-10-02 01:25:29 [INFO] Running: sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)

2025-10-02 01:25:30 [INFO] Running: git clone https://github.com/DevilCoders/Hacker-Blog.git
Cloning into 'Hacker-Blog'...
remote: Enumerating objects: 100, done.
remote: Total 100 (delta 0), reused 0 (delta 0), pack-reused 100
Receiving objects: 100% (100/100), 1.23 MiB | 2.00 MiB/s, done.

2025-10-02 01:25:32 [INFO] Running: cd Hacker-Blog/bitblog-api
2025-10-02 01:25:32 [INFO] Running: npm i
added 234 packages, and audited 235 packages in 10s

2025-10-02 01:25:42 [INFO] Creating .env file
2025-10-02 01:25:42 [INFO] Running: npm run build
> bitblog-api@1.0.0 build
> tsc
Compiled successfully.

2025-10-02 01:25:45 [INFO] Running: pm2 start dist/server.js --name "bitblog-api" -i max --max-memory-restart 300M --log /var/log/bitblog-api.log
[PM2] Starting /home/user/Hacker-Blog/bitblog-api/dist/server.js in cluster_mode (0 instances)
[PM2] Done.
┌────┬─────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name            │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼─────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bitblog-api     │ cluster  │ 0    │ online    │ 0%       │ 45.2mb   │
└────┴─────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

2025-10-02 01:25:46 [INFO] Running: pm2 save
[PM2] Saving current process list...
[PM2] Successfully saved in /home/user/.pm2/dump.pm2

2025-10-02 01:25:46 [INFO] Running: pm2 list
┌────┬─────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name            │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼─────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bitblog-api     │ cluster  │ 0    │ online    │ 0%       │ 45.2mb   │
└────┴─────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

2025-10-02 01:25:47 [INFO] Running: pm2 show bitblog-api
describing process with id 0 - name bitblog-api
┌───────────────────┬────────────────────┐
│ status            │ online             │
│ name              │ bitblog-api        │
│ namespace         │ default            │
│ mode              │ cluster            │
│ pid               │ 12345              │
│ uptime            │ 5s                 │
│ memory            │ 45.2 MB            │
│ log file          │ /var/log/bitblog-api.log │
└───────────────────┬────────────────────┘

2025-10-02 01:25:47 [INFO] Running: pm2 startup systemd -u user --hp /home/user
[PM2] Generating system init script in /etc/systemd/system/pm2-user.service
[PM2] Making script pm2-user.service start at boot...
[PM2] Done.

2025-10-02 01:25:48 [INFO] Running: cd ../..
2025-10-02 01:25:48 [INFO] Running: cd bitblog
2025-10-02 01:25:48 [INFO] Running: npm i
added 345 packages, and audited 346 packages in 15s

2025-10-02 01:26:03 [INFO] Running: npm run build
> bitblog@1.0.0 build
> vite build
vite v4.0.0 building for production...
✓ built in 2.34s

2025-10-02 01:26:05 [INFO] Adding domain to /etc/hosts
127.0.0.1 hacker-blog.tech

2025-10-02 01:26:05 [INFO] Running: sudo mkdir -p /var/www/hacker-blog.tech
2025-10-02 01:26:05 [INFO] Running: sudo cp -r dist/* /var/www/hacker-blog.tech/
2025-10-02 01:26:06 [INFO] Creating optimized Nginx site config
2025-10-02 01:26:06 [INFO] Running: sudo ln -s /etc/nginx/sites-available/hacker-blog.tech /etc/nginx/sites-enabled/
2025-10-02 01:26:06 [INFO] Running: sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

2025-10-02 01:26:07 [INFO] Running: sudo systemctl reload nginx
2025-10-02 01:26:07 [INFO] Running: sudo systemctl restart nginx
2025-10-02 01:26:08 [INFO] Running: sudo apt install certbot python3-certbot-nginx -y
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  certbot python3-certbot-nginx
0 upgraded, 2 newly installed, 0 to remove and 0 not upgraded.
After this operation, 2,456 kB of additional disk space will be used.
Selecting previously unselected package certbot.
Unpacking certbot (1.12.0-2) ...
Selecting previously unselected package python3-certbot-nginx.
Unpacking python3-certbot-nginx (1.12.0-2) ...
Setting up certbot (1.12.0-2) ...
Setting up python3-certbot-nginx (1.12.0-2) ...

2025-10-02 01:26:12 [INFO] Running: sudo certbot --nginx --non-interactive --agree-tos --email admin@hacker-blog.tech -d hacker-blog.tech -d www.hacker-blog.tech
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for hacker-blog.tech and www.hacker-blog.tech
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/hacker-blog.tech/fullchain.pem
Key is saved at: /etc/letsencrypt/live/hacker-blog.tech/privkey.pem
This certificate expires on 2026-01-01.
Deploying certificate
Successfully deployed certificate for hacker-blog.tech to /etc/nginx/sites-available/hacker-blog.tech
Successfully deployed certificate for www.hacker-blog.tech to /etc/nginx/sites-available/hacker-blog.tech
Congratulations! You have successfully enabled HTTPS on your domains.

2025-10-02 01:26:15 [INFO] Setup complete. Check: http://hacker-blog.tech
2025-10-02 01:26:15 [INFO] Setup complete. Check: https://hacker-blog.tech
2025-10-02 01:26:15 [INFO] Script execution finished
```
