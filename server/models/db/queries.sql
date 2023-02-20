-- name: CreateUser :one
INSERT INTO users (name) VALUES ($1) RETURNING id, name, role;

-- name: GetUser :one
SELECT id, name, role FROM users WHERE id = $1;

-- name: CreateTribe :one
INSERT INTO tribes (name) VALUES ($1) RETURNING *;

-- name: GetTribe :one
SELECT * FROM tribes WHERE id = $1;

-- name: CreateStudent :one
INSERT INTO students (name, tribe_id) VALUES ($1, $2) RETURNING *;

-- name: UpdateStudentName :exec
UPDATE students SET name = $2 WHERE id = $1;	

-- name: GetStudent :one
SELECT * FROM students WHERE id = $1;

-- name: GetStudents :many
SELECT * FROM students WHERE tribe_id = $1;

-- name: CreateSubject :one
INSERT INTO subjects (name, teacher_id, tribe_id) VALUES ($1, $2, $3) RETURNING *;
