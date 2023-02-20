package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/christiankozalla/sitzplan/server/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
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
	r.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		param := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(param, 10, 64)
		user, err := queries.GetUser(ctx, id)
		if err != nil {
			http.Error(w, "Error getting user", http.StatusInternalServerError)
			return
		}
		w.Write([]byte(fmt.Sprintf("ID: %d, Name: %s", user.ID, user.Name)))
	})

	r.Post("/users/{name}", func(w http.ResponseWriter, r *http.Request) {
		name := chi.URLParam(r, "name")
		user, err := queries.CreateUser(ctx, name)
		if err != nil {
			http.Error(w, "Error creating user", http.StatusInternalServerError)
			return
		}
		w.Write([]byte(fmt.Sprintf("ID: %d, Name: %s", user.ID, user.Name)))
	})

	http.ListenAndServe(":3000", r)
}