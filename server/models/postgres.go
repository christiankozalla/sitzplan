package models

import (
	"database/sql"
	"fmt"

	sqlcModels "github.com/christiankozalla/sitzplan/server/models/db"
	_ "github.com/lib/pq"
)

func Open(config PostgresConfig) (*sqlcModels.Queries, *sql.DB, error) {
	db, err := sql.Open("postgres", config.String())
	if err != nil {
		return nil, nil, fmt.Errorf("Open: %w", err)
	}
	queries := sqlcModels.New(db);
	return queries, db, nil
}

func DefaultPostgresConfig() PostgresConfig {
	return PostgresConfig{
		Host:     "localhost",
		Port:     "5432",
		User:     "postgres",
		Password: "mysecretpassword",
		Database: "sitzplan_dev",
		SSLMode:  "disable",
	}
}

type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Database string
	SSLMode  string
}

func (cfg PostgresConfig) String() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
	cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Database, cfg.SSLMode)
}
