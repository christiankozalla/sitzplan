CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'TEACHER'
);

CREATE TABLE IF NOT EXISTS tribes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  teacher_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT,
  tribe_id BIGINT REFERENCES tribes(id)
);

CREATE TABLE IF NOT EXISTS subjects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id BIGINT REFERENCES users(id),
  tribe_id BIGINT REFERENCES tribes(id)
);

CREATE TABLE IF NOT EXISTS student_subjects (
  student_id BIGINT REFERENCES students(id),
  subject_id BIGINT REFERENCES subjects(id),
  position POINT,
  PRIMARY KEY (student_id, subject_id)
);

CREATE TABLE IF NOT EXISTS constraints (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  teacher_id BIGINT REFERENCES users(id),
  subject_id BIGINT REFERENCES subjects(id),
  alone BOOLEAN DEFAULT FALSE,
  forbidden_students BIGINT[] DEFAULT '{}'
);

