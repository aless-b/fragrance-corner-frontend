FROM node:20-alpine

# Instalar Nginx, Fail2Ban, iptables e iproute2 para protección HTTP Flood
RUN apk add --no-cache nginx fail2ban bash iptables iproute2

WORKDIR /app

# Copiar archivos de definición de paquetes
COPY package*.json ./

# Instalación de dependencias
RUN npm install

# Copiar el código fuente del frontend
COPY . .

# Copiar configuraciones de Nginx y Fail2Ban
COPY nginx.conf /etc/nginx/nginx.conf
COPY jail.local /etc/fail2ban/jail.local
COPY filter-http-flood.conf /etc/fail2ban/filter.d/http-flood.conf
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Exponer puertos HTTP (80 y 5173)
EXPOSE 80 5173

ENTRYPOINT ["/entrypoint.sh"]
