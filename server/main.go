package main

import (
	"net/http"

	"github.com/christiankozalla/sitzplan/server/controllers"
	"github.com/christiankozalla/sitzplan/server/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	queries, db, err := models.Open(models.DefaultPostgresConfig())
	if err != nil {
		panic(err)
	}
	defer db.Close()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.AllowContentType("application/json"))

	// Setup services
	userService := &models.UserService{
		Queries: queries,
	}
	sessionService := &models.SessionService{
		Queries: queries,
	}

	// Setup controllers
	usersController := controllers.Users{SessionService: sessionService, UserService: userService}

	r.Group(func(r chi.Router) {
		r.Post("/api/users/create", usersController.CreateUser)
		r.Post("/api/users/login", usersController.LoginUser)
	})

	r.Group(func(r chi.Router) {
		r.Use(controllers.Auth(sessionService))
		r.Get("/api/users/me", usersController.Me)
		r.Delete("/api/users/logout", usersController.LogoutUser)
	})

	http.ListenAndServe(":3000", r)
}
