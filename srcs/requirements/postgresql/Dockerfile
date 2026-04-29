FROM alpine:3.18

RUN apk update && apk add --no-cache postgresql postgresql-contrib su-exec

RUN mkdir -p /var/lib/postgresql/data && \
    mkdir -p /run/postgresql && \
    # Wir machen alles für jeden beschreibbar, damit IDs egal sind
    chmod 777 /var/lib/postgresql /run/postgresql

COPY ./conf/setupPg.sh /usr/local/bin/setupPg.sh
RUN chmod +x /usr/local/bin/setupPg.sh

# Wir starten als root, um Rechte-Hürden zu nehmen
USER root

ENTRYPOINT ["sh", "/usr/local/bin/setupPg.sh"]