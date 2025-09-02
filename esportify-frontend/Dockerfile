# 1) Build de l’app Angular
FROM node:18-alpine AS builder
WORKDIR /app

# Copie des manifestes et installation
COPY package*.json ./
RUN npm install

# Copie du code et build en prod
COPY . .
RUN npm run build -- --configuration production

# 2) Serveur Nginx
FROM nginx:alpine

# On remplace la conf par défaut pour gérer le fallback Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie ensuite le build "browser" (index.html, main.js, etc.)
COPY --from=builder /app/dist/esportify/browser /usr/share/nginx/html

# Expose le port 80 (mappé sur le 4200 de l’hôte)
EXPOSE 80

# Commande de lancement Nginx
CMD ["nginx", "-g", "daemon off;"]
