CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'TEACHER'
);
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- if a user is deleted, their session will be deleted too
    token_hash TEXT NOT NULL
);
-- a tribe is a class - it groups students together
CREATE TABLE IF NOT EXISTS tribes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    head_teacher_id INT REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    tribe_id INT REFERENCES tribes(id)
);
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name TEXT
);
-- a table has a room and a position (x, y)
-- a table may have a student sitting on it
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    position POINT
);
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    teacher_id INT REFERENCES users(id),
    tribe_id INT REFERENCES tribes(id),
    -- subjects can be queried by tribe_id: SELECT * FROM subjects WHERE subjects.tribe_id = $1
    room_id INT REFERENCES rooms(id)
);
-- a student may be sitting on a table
CREATE TABLE IF NOT EXISTS student_table_subject (
    student_id INT REFERENCES students(id),
    table_id INT REFERENCES tables(id),
    subject_id INT REFERENCES subjects(id),
    PRIMARY KEY (student_id, table_id, subject_id)
);
-- CREATE TABLE IF NOT EXISTS constraints (
--     id SERIAL PRIMARY KEY,
--     student_id INT REFERENCES students(id),
--     teacher_id INT REFERENCES users(id),
--     subject_id INT REFERENCES subjects(id),
--     alone BOOLEAN DEFAULT FALSE,
--     forbidden_students BIGINT[] DEFAULT '{}'
-- );
-- Path: server/models/db/schema-v3.sql
-- Compare this snippet from server/models/db/schema-v2.sql:
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   email TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   role TEXT DEFAULT 'TEACHER'
-- );
-- 
-- CREATE TABLE IF NOT EXISTS tribes (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   head_teacher_id INT REFERENCES users(id)
-- );  
-- 
-- CREATE TABLE IF NOT EXITS students (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   tribe_id INT REFERENCES tribes(id)
-- );
-- 
-- CREATE TABLE IF NOT EXISTS rooms (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );
-- 
-- CREATE TABLE IF NOT EXISTS tables (
--   id SERIAL PRIMARY KEY,
--   room_id INT REFERENCES rooms(id),
--   position POINT
-- );
-- 
-- CREATE TABLE IF NOT EXISTS student_tables (
--   student_id INT REFERENCES students(id),
--   table_id INT REFERENCES tables(id),
--   PRIMARY KEY (student_id, table_id)
-- );
-- 
-- CREATE TABLE IF NOT EXISTS subjects (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   teacher_id INT REFERENCES users(id),
--   tribe_id INT REFERENCES tribes(id)
-- );
-- 
-- CREATE TABLE IF NOT EXISTS student_subjects (
--   student_id INT REFERENCES students(id),
--   subject_id INT REFERENCES subjects
-- );