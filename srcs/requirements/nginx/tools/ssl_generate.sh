#!/bin/bash
set -ex

# Erstelle das Verzeichnis für die Zertifikate, falls es nicht existiert
mkdir -p /etc/nginx/ssl

# Generiere das selbstsignierte Zertifikat
# -x509: Erstellt ein Zertifikat statt eines Requests
# -nodes: Kein Passwort für den privaten Schlüssel (wichtig für automatischen Start)
# -days 365: Gültigkeit
# -subj: Metadaten des Zertifikats (L=Location, O=Organization, CN=Common Name)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=DE/ST=Berlin/L=Berlin/O=42/OU=42Berlin/CN=${DOMAIN_NAME}"

# Führe den NGINX-Befehl aus, der im Dockerfile als CMD übergeben wurde
exec "$@"