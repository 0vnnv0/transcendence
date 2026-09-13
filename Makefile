COMPOSE_FILE = srcs/docker-compose.yml
DATA_DIR = $(HOME)/data
DB_DIR = $(HOME)/data/db/

.PHONY: all build up down clean fclean re sync

all: build up

build:
	@mkdir -p $(DATA_DIR)
	@mkdir -p $(DB_DIR)
# 	@chmod -R 777 $(DB_DIR)
	docker compose -f $(COMPOSE_FILE) build

# -f (file) gives location of a backup compose file
# -d (detach) containers are run in the background.
up:
	docker compose -f $(COMPOSE_FILE) up -d

sync:
	docker compose -f $(COMPOSE_FILE) exec -it backend npm run sync

down:
	docker compose -f $(COMPOSE_FILE) down -v

# deletes all images -a = removes all unused docker resources, and cleans up
clean:
	docker system prune -af 

# removes unused volumes
fclean: down clean
# 	-docker volume rm srcs_postgres_data
	docker run --rm -v $(DATA_DIR):/cleanup alpine rm -rf /cleanup/db
	rm -rf $(DATA_DIR)
# 	docker system prune -af --volumes

re: fclean all
