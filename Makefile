all:
	@awk -F'[ :]' '!/^all:/ && /^([A-z_-]+):/ {print "make " $$1}' Makefile

db-generate:
	sqlc generate -f ./server/models/db/sqlc.yaml
	docker stop sitzplan-dev
	docker rm sitzplan-dev

client-bootstrap:
	rm -rf frontend/node_modules
	cd frontend && npm install

db-start:
	./server/start-dev-db.sh

db-psql:
	docker exec -it sitzplan-dev /usr/bin/psql -U postgres -d sitzplan_dev

server-run:
	cd server && GO_ENV=development modd

client-run:
	cd frontend && npm run dev

caddy:
	caddy start --config ./caddy/Caddyfile.dev

# Access running container db
#  docker exec -it sitzplan-dev /usr/bin/psql -U postgres -d sitzplan_dev