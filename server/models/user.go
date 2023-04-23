package models

import (
	"context"
	"errors"
	"strings"

	"github.com/christiankozalla/sitzplan/server/models/db"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	Queries *db.Queries
}

func (us *UserService) Create(email, password string) (*db.CreateUserRow, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("error hashing password")
	}
	passwordHash := string(hashedBytes)

	user, err := us.Queries.CreateUser(context.Background(), db.CreateUserParams{
		Email:        strings.ToLower(email),
		PasswordHash: passwordHash,
	})
	if err != nil {
		return nil, errors.New("DB Error")
	}
	return &user, nil
}

func (us *UserService) Authenticate(email, password string) (*db.CreateUserRow, error) {
	user, err := us.Queries.GetUser(context.Background(), strings.ToLower(email))
	if err != nil {
		return nil, errors.New("DB error")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, errors.New("invalid password")
	}
	return &db.CreateUserRow{ID: user.ID, Email: user.Email}, nil
}
