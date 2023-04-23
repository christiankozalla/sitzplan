// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.17.0
// source: queries-v2.sql

package db

import (
	"context"
	"database/sql"
)

const createRoom = `-- name: CreateRoom :one
INSERT INTO rooms (name) VALUES ($1) RETURNING id, name
`

func (q *Queries) CreateRoom(ctx context.Context, name sql.NullString) (Room, error) {
	row := q.db.QueryRowContext(ctx, createRoom, name)
	var i Room
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}

const createSession = `-- name: CreateSession :one
INSERT INTO sessions (user_id, token_hash) VALUES ($1, $2)
ON CONFLICT (user_id) DO UPDATE SET token_hash = $2 RETURNING id, user_id, token_hash
`

type CreateSessionParams struct {
	UserID    int32
	TokenHash string
}

func (q *Queries) CreateSession(ctx context.Context, arg CreateSessionParams) (Session, error) {
	row := q.db.QueryRowContext(ctx, createSession, arg.UserID, arg.TokenHash)
	var i Session
	err := row.Scan(&i.ID, &i.UserID, &i.TokenHash)
	return i, err
}

const createStudent = `-- name: CreateStudent :one
INSERT INTO students (name, tribe_id) VALUES ($1, $2) RETURNING id, name, tribe_id
`

type CreateStudentParams struct {
	Name    string
	TribeID sql.NullInt32
}

func (q *Queries) CreateStudent(ctx context.Context, arg CreateStudentParams) (Student, error) {
	row := q.db.QueryRowContext(ctx, createStudent, arg.Name, arg.TribeID)
	var i Student
	err := row.Scan(&i.ID, &i.Name, &i.TribeID)
	return i, err
}

const createSubject = `-- name: CreateSubject :one
INSERT INTO subjects (name, teacher_id, tribe_id, room_id) VALUES ($1, $2, $3, $4) RETURNING id, name, teacher_id, tribe_id, room_id
`

type CreateSubjectParams struct {
	Name      string
	TeacherID sql.NullInt32
	TribeID   sql.NullInt32
	RoomID    sql.NullInt32
}

func (q *Queries) CreateSubject(ctx context.Context, arg CreateSubjectParams) (Subject, error) {
	row := q.db.QueryRowContext(ctx, createSubject,
		arg.Name,
		arg.TeacherID,
		arg.TribeID,
		arg.RoomID,
	)
	var i Subject
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.TeacherID,
		&i.TribeID,
		&i.RoomID,
	)
	return i, err
}

const createTable = `-- name: CreateTable :one
INSERT INTO tables (room_id, position) VALUES ($1, $2) RETURNING id, room_id, position
`

type CreateTableParams struct {
	RoomID   sql.NullInt32
	Position interface{}
}

func (q *Queries) CreateTable(ctx context.Context, arg CreateTableParams) (Table, error) {
	row := q.db.QueryRowContext(ctx, createTable, arg.RoomID, arg.Position)
	var i Table
	err := row.Scan(&i.ID, &i.RoomID, &i.Position)
	return i, err
}

const createTribe = `-- name: CreateTribe :one
INSERT INTO tribes (name) VALUES ($1) RETURNING id, name, head_teacher_id
`

func (q *Queries) CreateTribe(ctx context.Context, name sql.NullString) (Tribe, error) {
	row := q.db.QueryRowContext(ctx, createTribe, name)
	var i Tribe
	err := row.Scan(&i.ID, &i.Name, &i.HeadTeacherID)
	return i, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email
`

type CreateUserParams struct {
	Email        string
	PasswordHash string
}

type CreateUserRow struct {
	ID    int32
	Email string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (CreateUserRow, error) {
	row := q.db.QueryRowContext(ctx, createUser, arg.Email, arg.PasswordHash)
	var i CreateUserRow
	err := row.Scan(&i.ID, &i.Email)
	return i, err
}

const deleteSession = `-- name: DeleteSession :exec
DELETE FROM sessions WHERE token_hash = $1
`

func (q *Queries) DeleteSession(ctx context.Context, tokenHash string) error {
	_, err := q.db.ExecContext(ctx, deleteSession, tokenHash)
	return err
}

const deleteTable = `-- name: DeleteTable :exec
DELETE FROM tables WHERE id = $1
`

func (q *Queries) DeleteTable(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteTable, id)
	return err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1
`

func (q *Queries) DeleteUser(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteUser, id)
	return err
}

const getRooms = `-- name: GetRooms :many
SELECT id, name FROM rooms
`

func (q *Queries) GetRooms(ctx context.Context) ([]Room, error) {
	rows, err := q.db.QueryContext(ctx, getRooms)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Room
	for rows.Next() {
		var i Room
		if err := rows.Scan(&i.ID, &i.Name); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getStudent = `-- name: GetStudent :one
SELECT id, name, tribe_id FROM students WHERE id = $1
`

func (q *Queries) GetStudent(ctx context.Context, id int32) (Student, error) {
	row := q.db.QueryRowContext(ctx, getStudent, id)
	var i Student
	err := row.Scan(&i.ID, &i.Name, &i.TribeID)
	return i, err
}

const getStudentsByTribeId = `-- name: GetStudentsByTribeId :many
SELECT id, name, tribe_id FROM students WHERE tribe_id = $1
`

func (q *Queries) GetStudentsByTribeId(ctx context.Context, tribeID sql.NullInt32) ([]Student, error) {
	rows, err := q.db.QueryContext(ctx, getStudentsByTribeId, tribeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Student
	for rows.Next() {
		var i Student
		if err := rows.Scan(&i.ID, &i.Name, &i.TribeID); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getSubjectsByTeacherId = `-- name: GetSubjectsByTeacherId :many
SELECT id, name, teacher_id, tribe_id, room_id FROM subjects WHERE teacher_id = $1
`

func (q *Queries) GetSubjectsByTeacherId(ctx context.Context, teacherID sql.NullInt32) ([]Subject, error) {
	rows, err := q.db.QueryContext(ctx, getSubjectsByTeacherId, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Subject
	for rows.Next() {
		var i Subject
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.TeacherID,
			&i.TribeID,
			&i.RoomID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getSubjectsByTribeId = `-- name: GetSubjectsByTribeId :many
SELECT id, name, teacher_id, tribe_id, room_id FROM subjects WHERE tribe_id = $1
`

func (q *Queries) GetSubjectsByTribeId(ctx context.Context, tribeID sql.NullInt32) ([]Subject, error) {
	rows, err := q.db.QueryContext(ctx, getSubjectsByTribeId, tribeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Subject
	for rows.Next() {
		var i Subject
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.TeacherID,
			&i.TribeID,
			&i.RoomID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTablesByRoomId = `-- name: GetTablesByRoomId :many
SELECT id, room_id, position FROM tables WHERE room_id = $1
`

func (q *Queries) GetTablesByRoomId(ctx context.Context, roomID sql.NullInt32) ([]Table, error) {
	rows, err := q.db.QueryContext(ctx, getTablesByRoomId, roomID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Table
	for rows.Next() {
		var i Table
		if err := rows.Scan(&i.ID, &i.RoomID, &i.Position); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTribe = `-- name: GetTribe :one
SELECT id, name, head_teacher_id FROM tribes WHERE id = $1
`

func (q *Queries) GetTribe(ctx context.Context, id int32) (Tribe, error) {
	row := q.db.QueryRowContext(ctx, getTribe, id)
	var i Tribe
	err := row.Scan(&i.ID, &i.Name, &i.HeadTeacherID)
	return i, err
}

const getUser = `-- name: GetUser :one
SELECT id, email, password_hash FROM users WHERE email = $1
`

type GetUserRow struct {
	ID           int32
	Email        string
	PasswordHash string
}

func (q *Queries) GetUser(ctx context.Context, email string) (GetUserRow, error) {
	row := q.db.QueryRowContext(ctx, getUser, email)
	var i GetUserRow
	err := row.Scan(&i.ID, &i.Email, &i.PasswordHash)
	return i, err
}

const getUserBySessionToken = `-- name: GetUserBySessionToken :one
SELECT users.id, email, password_hash, role, sessions.id, user_id, token_hash FROM users
JOIN sessions ON users.id = sessions.user_id
WHERE sessions.token_hash = $1
`

type GetUserBySessionTokenRow struct {
	ID           int32
	Email        string
	PasswordHash string
	Role         sql.NullString
	ID_2         int32
	UserID       int32
	TokenHash    string
}

func (q *Queries) GetUserBySessionToken(ctx context.Context, tokenHash string) (GetUserBySessionTokenRow, error) {
	row := q.db.QueryRowContext(ctx, getUserBySessionToken, tokenHash)
	var i GetUserBySessionTokenRow
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Role,
		&i.ID_2,
		&i.UserID,
		&i.TokenHash,
	)
	return i, err
}

const placeStudentOnTable = `-- name: PlaceStudentOnTable :exec
INSERT INTO student_table_subject (student_id, table_id, subject_id) VALUES ($1, $2, $3)
`

type PlaceStudentOnTableParams struct {
	StudentID int32
	TableID   int32
	SubjectID int32
}

func (q *Queries) PlaceStudentOnTable(ctx context.Context, arg PlaceStudentOnTableParams) error {
	_, err := q.db.ExecContext(ctx, placeStudentOnTable, arg.StudentID, arg.TableID, arg.SubjectID)
	return err
}

const removeStudentFromTable = `-- name: RemoveStudentFromTable :exec
DELETE FROM student_table_subject WHERE student_id = $1 AND table_id = $2 AND subject_id = $3
`

type RemoveStudentFromTableParams struct {
	StudentID int32
	TableID   int32
	SubjectID int32
}

func (q *Queries) RemoveStudentFromTable(ctx context.Context, arg RemoveStudentFromTableParams) error {
	_, err := q.db.ExecContext(ctx, removeStudentFromTable, arg.StudentID, arg.TableID, arg.SubjectID)
	return err
}

const updateStudentName = `-- name: UpdateStudentName :exec
UPDATE students SET name = $2 WHERE id = $1
`

type UpdateStudentNameParams struct {
	ID   int32
	Name string
}

func (q *Queries) UpdateStudentName(ctx context.Context, arg UpdateStudentNameParams) error {
	_, err := q.db.ExecContext(ctx, updateStudentName, arg.ID, arg.Name)
	return err
}

const updateStudentOnTable = `-- name: UpdateStudentOnTable :exec
UPDATE student_table_subject SET student_id = $1 WHERE student_id = $2 AND table_id = $3 AND subject_id = $4
`

type UpdateStudentOnTableParams struct {
	StudentID   int32
	StudentID_2 int32
	TableID     int32
	SubjectID   int32
}

func (q *Queries) UpdateStudentOnTable(ctx context.Context, arg UpdateStudentOnTableParams) error {
	_, err := q.db.ExecContext(ctx, updateStudentOnTable,
		arg.StudentID,
		arg.StudentID_2,
		arg.TableID,
		arg.SubjectID,
	)
	return err
}

const updateTablePosition = `-- name: UpdateTablePosition :exec
UPDATE tables SET position = $2 WHERE id = $1
`

type UpdateTablePositionParams struct {
	ID       int32
	Position interface{}
}

func (q *Queries) UpdateTablePosition(ctx context.Context, arg UpdateTablePositionParams) error {
	_, err := q.db.ExecContext(ctx, updateTablePosition, arg.ID, arg.Position)
	return err
}
