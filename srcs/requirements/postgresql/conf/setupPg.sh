#!/bin/sh

# 1. Pfade definieren
DATA_DIR="/var/lib/postgresql/data"
PG_DATA="$DATA_DIR/db"

# 2. Verzeichnisse als ROOT vorbereiten (das darf nur root)
mkdir -p "$DATA_DIR" /run/postgresql
# Wir geben dem User postgres (UID 70) die Gewalt über die Ordner
chown -R postgres:postgres "$DATA_DIR" /run/postgresql
chmod 777 /run/postgresql

# 3. Initialisierung (NUR wenn db noch nicht existiert)
if [ ! -d "$PG_DATA" ]; then
    echo "Initializing database..."
    # WICHTIG: su-exec <user> <befehl>
    su-exec postgres initdb -D "$PG_DATA"
    
    echo "Starting temporary server for setup..."
    su-exec postgres pg_ctl -D "$PG_DATA" -w start
    
    # Passwort aus Secret lesen
    DB_PASSWORD=$(cat /run/secrets/db_password)

    echo "Creating user and database..."
    su-exec postgres psql --command "CREATE USER \"$POSTGRES_USER\" WITH SUPERUSER PASSWORD '$DB_PASSWORD';"
    su-exec postgres psql --command "CREATE DATABASE \"$POSTGRES_DB\" OWNER \"$POSTGRES_USER\";"
    
    echo "Stopping temporary server..."
    su-exec postgres pg_ctl -D "$PG_DATA" -m fast -w stop
fi

# 4. Der eigentliche Start
echo "Starting PostgreSQL..."
# exec ersetzt den Shell-Prozess durch den Postgres-Prozess (als User postgres!)
exec su-exec postgres postgres -D "$PG_DATA" -h 0.0.0.0