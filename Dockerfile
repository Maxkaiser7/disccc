FROM node:18-alpine

# Définition du répertoire de travail dans l'image Docker
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./public/images/artists ./public/images/artists
COPY ./public/images/events ./public/images/events
COPY ./public/images/organisations ./public/images/organisations


# Build de l'application
RUN npm run build

# Suppression des dépendances à la fin pour réduire la taille de l'image
RUN rm -fr node_modules

EXPOSE 3000

# Démarrage de l'application avec la commande serve
CMD [ "serve", "-s", "build" ]