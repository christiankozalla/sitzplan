all:
	@awk -F'[ :]' '!/^all:/ && /^([A-z_-]+):/ {print "make " $$1}' Makefile

generate-db:
	sqlc generate -f ./server/models/sqlc/sqlc.yaml

bootstrap:
	rm -rf frontend/node_modules
	cd frontend && npm install

start-db:
	./server/start-dev-db.sh

run-server:
	cd server && go run main.go

run-client:
	cd frontend && npm run dev