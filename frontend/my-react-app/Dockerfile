# --- Phase de build ---
FROM node:18-alpine AS build

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances et installe-les
COPY package*.json ./
RUN npm install

# Copie le reste du code source
COPY . .

# Construit l'application React
RUN npm run build

# --- Phase de production (serveur Nginx) ---
FROM nginx:alpine

# Copie la configuration Nginx personnalisée (si nécessaire, sinon Nginx utilise sa conf par défaut)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques construits depuis la phase de build vers le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port HTTP par défaut
EXPOSE 80

# Commande pour démarrer Nginx (par défaut pour l'image nginx:alpine)
CMD ["nginx", "-g", "daemon off;"]
