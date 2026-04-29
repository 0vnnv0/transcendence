FROM node:24-alpine

WORKDIR /transcendence

# Erst die package-Dateien für den Cache
COPY package*.json ./

# Prisma-Ordner kopieren (muss im selben Ordner wie das Dockerfile liegen!)
COPY prisma ./prisma/

# Installiere alle Dependencies (inkl. Prisma CLI)
RUN npm install

# Generiere den Prisma Client
RUN npx prisma generate

# Den Rest des Codes kopieren
COPY . .

# EXPOSE 3000
CMD ["npx", "tsx", "src/index.ts"]
