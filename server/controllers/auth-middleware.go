package controllers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/christiankozalla/sitzplan/server/models"
)

type key string

const (
	userKey  key = "userKey"
	tokenKey key = "userToken"
)

// HTTP middleware setting a value on the request context
func Auth(ss *models.SessionService) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token, err := readCookie(r, CookieSession)
			if err != nil {
				http.Error(w, ErrorResponse{Error: "Failed To Read Cookie: " + err.Error()}.Json(), http.StatusBadRequest)
				return
			}

			user, err := ss.User(token)
			if err != nil {
				fmt.Println(token)
				http.Error(w, ErrorResponse{Error: "Failed To Get User: " + err.Error()}.Json(), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userKey, user)
			ctx = context.WithValue(ctx, tokenKey, token)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
