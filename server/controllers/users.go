package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/christiankozalla/sitzplan/server/models/db"
	"golang.org/x/crypto/bcrypt"
)

type Users struct {
	Queries *db.Queries
}

type NewUser struct {
	Email        string	`json:"email"`
	Password 	 string `json:"password"`
}

type UserWithoutPassword struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
}

// CreateUser returns a handler that creates a user.
func (u Users) CreateUser(w http.ResponseWriter, r *http.Request) {
		var newUser NewUser
		if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		newUser.Email = strings.ToLower(newUser.Email)

		hashedBytes, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusUnprocessableEntity)
			return
		}
		passwordHash := string(hashedBytes)

		createdUser, err := u.Queries.CreateUser(context.Background(), db.CreateUserParams{
			Email:        newUser.Email,
			PasswordHash: passwordHash,
		})
		if err != nil {
			http.Error(w, "Error creating user", http.StatusUnprocessableEntity)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(createdUser)
	}

func (u Users) LoginUser(w http.ResponseWriter, r *http.Request) {
		var userLogginIn NewUser
		if err := json.NewDecoder(r.Body).Decode(&userLogginIn); err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}
		
		userLogginIn.Email = strings.ToLower(userLogginIn.Email)

		user, err := u.Queries.GetUser(context.Background(), userLogginIn.Email)
		if err != nil {
			http.Error(w, "Error getting user", http.StatusUnprocessableEntity)
			return
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(userLogginIn.Password)); err != nil {
			http.Error(w, "Error comparing password", http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(
			UserWithoutPassword{ID: user.ID, Email: user.Email},
		)
	}