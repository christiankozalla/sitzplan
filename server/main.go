package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/christiankozalla/sitzplan/server/controllers"
	"github.com/christiankozalla/sitzplan/server/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	ctx := context.Background()

	queries, db, err := models.Open(models.DefaultPostgresConfig())
	if err != nil {
		panic(err)
	}
	defer db.Close()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	usersController := controllers.Users{Queries: queries}

	r.Get("/users/get/{email}", func(w http.ResponseWriter, r *http.Request) {
		email := chi.URLParam(r, "email")
		user, err := queries.GetUser(ctx, email)
		if err != nil {
			http.Error(w, "Error getting user", http.StatusInternalServerError)
			return
		}
		w.Write([]byte(fmt.Sprintf("ID: %d, Email: %s", user.ID, user.Email)))
	})

	r.Post("/users/create", usersController.CreateUser)
	r.Post("/users/login", usersController.LoginUser)

	http.ListenAndServe(":3000", r)
}
