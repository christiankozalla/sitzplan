package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/christiankozalla/sitzplan/server/models"
	"github.com/christiankozalla/sitzplan/server/models/db"
)

type Users struct {
	SessionService *models.SessionService
	UserService    *models.UserService
}

type ClientUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func (er ErrorResponse) Json() string {
	json, _ := json.Marshal(er)
	return string(json)
}

// CreateUser returns a handler that creates a user.
func (u Users) CreateUser(w http.ResponseWriter, r *http.Request) {
	var newUser ClientUser
	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		http.Error(w, ErrorResponse{Error: "Request Body Unprocessable"}.Json(), http.StatusBadRequest)
		return
	}

	createdUser, err := u.UserService.Create(newUser.Email, newUser.Password)

	if err != nil {
		http.Error(w, ErrorResponse{Error: "Failed To Create User: " + err.Error()}.Json(), http.StatusUnprocessableEntity)
		return
	}

	sessionToken, err := u.SessionService.Create(createdUser.ID)
	if err != nil {
		fmt.Println(err)

		http.Error(w, ErrorResponse{Error: "Failed To Create Session"}.Json(), http.StatusUnprocessableEntity)
		return
	}

	setCookie(w, CookieSession, sessionToken)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdUser)
}

func (u Users) LoginUser(w http.ResponseWriter, r *http.Request) {
	var userLogginIn ClientUser
	if err := json.NewDecoder(r.Body).Decode(&userLogginIn); err != nil {
		http.Error(w, ErrorResponse{Error: "Request Body Unprocessable"}.Json(), http.StatusBadRequest)
		return
	}

	user, err := u.UserService.Authenticate(userLogginIn.Email, userLogginIn.Password)
	if err != nil {
		http.Error(w, ErrorResponse{Error: "Failed To Authenticate User: " + err.Error()}.Json(), http.StatusUnauthorized)
		return
	}

	sessionToken, err := u.SessionService.Create(user.ID)
	if err != nil {
		fmt.Println(err)

		http.Error(w, ErrorResponse{Error: "Failed To Create Session"}.Json(), http.StatusUnprocessableEntity)
		return
	}

	setCookie(w, CookieSession, sessionToken)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func (u Users) Me(w http.ResponseWriter, r *http.Request) {
	userWithToken := r.Context().Value(userKey).(*db.GetUserBySessionTokenRow)

	user := &db.User{
		ID:    userWithToken.ID,
		Email: userWithToken.Email,
		Role:  userWithToken.Role,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func (u Users) LogoutUser(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value(tokenKey).(string)
	deleteCookie(w, CookieSession)

	err := u.SessionService.Delete(token)
	if err != nil {
		http.Error(w, ErrorResponse{Error: "Failed To Delete Session: " + err.Error()}.Json(), http.StatusNotFound)
		return
	}
	fmt.Println("Deleted Session")
	w.WriteHeader(http.StatusOK)
}
