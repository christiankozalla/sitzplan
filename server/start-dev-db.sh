CONTAINER_ID=$(
docker run --name sitzplan-dev -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d --mount type=bind,source="$(pwd)"/server/models/db,target=/db postgres
)

# wait for the container to start
sleep 5
# log the container id
echo "Container ID: $CONTAINER_ID"

# run the sql script to create the database
docker exec -i $CONTAINER_ID psql -U postgres -f /db/create-db.sql

# run sql script to create the tables
docker exec -i $CONTAINER_ID psql -U postgres -d sitzplan_dev -a -f /db/schema.sql