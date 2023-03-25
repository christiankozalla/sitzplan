all:
	@awk -F'[ :]' '!/^all:/ && /^([A-z_-]+):/ {print "make " $$1}' Makefile

db-generate:
	sqlc generate -f ./server/models/db/sqlc.yaml

client-bootstrap:
	rm -rf frontend/node_modules
	cd frontend && npm install

db-start:
	./server/start-dev-db.sh

server-run:
	cd server && go run main.go

client-run:
	cd frontend && npm run dev

# Access running container db
#  docker exec -it sitzplan-dev /usr/bin/psql -U postgres -d sitzplan_dev