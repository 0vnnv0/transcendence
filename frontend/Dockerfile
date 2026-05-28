# --- STAGE 1: Build der React Anwendung ---
FROM node:24-alpine AS builder

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

COPY . .

# Argument für die Backend-URL entgegennehmen (wichtig für React!)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# --- STAGE 2: Auslieferung via Nginx ---
FROM nginx:alpine
# Kopiere die statischen React-Dateien in das Standard-Nginx-Verzeichnis
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiere eine eigene Nginx-Konfiguration für das Routing (siehe Schritt 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]