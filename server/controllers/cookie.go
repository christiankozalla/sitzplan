package controllers

import (
	"fmt"
	"net/http"
	"os"
)

const (
	CookieSession = "sitzplan_session"
)

func newCookie(name, value string) *http.Cookie {
	return &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: false,
		Secure:   os.Getenv("GO_ENV") != "development",
	}
}

func setCookie(w http.ResponseWriter, name, value string) {
	http.SetCookie(w, newCookie(name, value))
}

func readCookie(r *http.Request, name string) (string, error) {
	cookie, err := r.Cookie(name)
	if err != nil {
		return "", fmt.Errorf("%s %w", name, err)
	}
	return cookie.Value, nil
}

func deleteCookie(w http.ResponseWriter, name string) {
	cookie := newCookie(name, "")
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)
}
