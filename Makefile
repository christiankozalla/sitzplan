all:
	@awk -F'[ :]' '!/^all:/ && /^([A-z_-]+):/ {print "make " $$1}' Makefile

# tools:
# 	GO111MODULE=off go get -u github.com/goware/webify

# generate: generate-server generate-client

# generate-server:
# 	webrpc-gen -schema=schema.ridl -target=golang -pkg=main -server -out=./server/schema.gen.go

# generate-client:
# 	webrpc-gen -schema=schema.ridl -target=typescript -client -out=./frontend/src/client.gen.ts

generate-db:
	sqlc generate -f ./server/models/sqlc/sqlc.yaml

bootstrap:
	rm -rf frontend/node_modules
	cd frontend && npm install

start-db:
	./start-dev-db.sh

run-server:
	cd server && go run main.go

run-client:
	cd frontend && npm run dev