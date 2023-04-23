-- name: GetUserBySessionToken :one
SELECT * FROM users
JOIN sessions ON users.id = sessions.user_id
WHERE sessions.token_hash = $1;

-- name: CreateSession :one
INSERT INTO sessions (user_id, token_hash) VALUES ($1, $2)
ON CONFLICT (user_id) DO UPDATE SET token_hash = $2 RETURNING *;

-- name: DeleteSession :exec
DELETE FROM sessions WHERE token_hash = $1;

-- name: CreateUser :one
INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email;

-- name: GetUser :one
SELECT id, email, password_hash FROM users WHERE email = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

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

-- name: GetStudentsByTribeId :many
SELECT * FROM students WHERE tribe_id = $1;

-- name: CreateRoom :one
INSERT INTO rooms (name) VALUES ($1) RETURNING *;

-- name: GetRooms :many
SELECT * FROM rooms;

-- name: GetTablesByRoomId :many
SELECT * FROM tables WHERE room_id = $1;

-- name: CreateTable :one
INSERT INTO tables (room_id, position) VALUES ($1, $2) RETURNING *;

-- name: UpdateTablePosition :exec
UPDATE tables SET position = $2 WHERE id = $1;

-- name: DeleteTable :exec
DELETE FROM tables WHERE id = $1;

-- name: CreateSubject :one
INSERT INTO subjects (name, teacher_id, tribe_id, room_id) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetSubjectsByTribeId :many
SELECT * FROM subjects WHERE tribe_id = $1;

-- name: GetSubjectsByTeacherId :many
SELECT * FROM subjects WHERE teacher_id = $1;

-- name: PlaceStudentOnTable :exec
INSERT INTO student_table_subject (student_id, table_id, subject_id) VALUES ($1, $2, $3);

-- name: UpdateStudentOnTable :exec
UPDATE student_table_subject SET student_id = $1 WHERE student_id = $2 AND table_id = $3 AND subject_id = $4;

-- name: RemoveStudentFromTable :exec
DELETE FROM student_table_subject WHERE student_id = $1 AND table_id = $2 AND subject_id = $3;
