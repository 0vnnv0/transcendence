# FROM nginx:latest

# COPY index.html /usr/share/nginx/html/index.html

FROM debian:bookworm

RUN apt-get update && apt-get install -y nginx openssl

# Kopiere die Konfiguration
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Kopiere das Tool-Skript
COPY tools/ssl_generate.sh /usr/local/bin/ssl_generate.sh
RUN chmod +x /usr/local/bin/ssl_generate.sh

# Exponiere den HTTPS Port
EXPOSE 443

# Nutze das Skript als Entrypoint, um das Zertifikat zu erstellen
ENTRYPOINT ["/usr/local/bin/ssl_generate.sh"]

# Starte NGINX im Vordergrund
CMD ["nginx", "-g", "daemon off;"]