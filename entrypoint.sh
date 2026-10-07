#!/bin/bash
set -e

mkdir -p /var/log/nginx /var/run/fail2ban /run/nginx
rm -f /var/log/nginx/access.log /var/log/nginx/error.log
touch /var/log/nginx/access.log /var/log/nginx/error.log /var/log/fail2ban.log
rm -f /var/run/fail2ban/fail2ban.sock /var/run/fail2ban/fail2ban.pid

# Iniciar servidor Vite internamente en 127.0.0.1:5174
npm run dev -- --host 127.0.0.1 --port 5174 &

# Iniciar Nginx en puertos 80 y 5173 registrando en /var/log/nginx/access.log
nginx -g 'daemon off;' &
sleep 1

# Iniciar Fail2Ban monitoreando /var/log/nginx/access.log
fail2ban-client -x start

echo "[perfume-frontend] Vite + Nginx + Fail2Ban (http-flood) running..."
exec tail -F /var/log/fail2ban.log /var/log/nginx/access.log
