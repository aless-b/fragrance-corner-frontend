FROM node:20-alpine

WORKDIR /app

# Copiar archivos de definición de paquetes
COPY package*.json ./

# Instalación de dependencias
RUN npm install

# Copiar el código fuente del frontend
COPY . .

# Exponer el puerto predeterminado de Vite
EXPOSE 5173

# Ejecutar el servidor de desarrollo Vite aceptando conexiones externas (--host 0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
