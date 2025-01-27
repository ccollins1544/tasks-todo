upstream tasks_frontend {
    server localhost:3004;
}

upstream tasks_backend {
    server localhost:3005;
}

server {
    server_name tasks.ccollins.io;
    root /home/bitnami/tasks-todo-live/source/client;

    location / {
        proxy_pass http://tasks_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io/ {
      proxy_pass http://tasks_backend/socket.io/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # SSL Configuration 
    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tasks.ccollins.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tasks.ccollins.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

# HTTP -> HTTPS Redirect
server {
    if ($host = tasks.ccollins.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name tasks.ccollins.io;
    return 404; # managed by Certbot
}
