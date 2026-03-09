# Image Node avec Chrome préinstallé pour Puppeteer
FROM ghcr.io/puppeteer/puppeteer:21.6.1

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances (en tant que root pour les permissions)
USER root
RUN npm ci

# Copier le code source
COPY index.ts ./

# Compiler TypeScript
RUN npx tsc

# Exposer le port
EXPOSE 3001

# Lancer le serveur compilé
CMD ["node", "dist/index.js"]