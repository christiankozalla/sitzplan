package models

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"

	"github.com/christiankozalla/sitzplan/server/models/db"
	"github.com/christiankozalla/sitzplan/server/rand"
)

const (
	MinBytesPerToken = 32
)

type SessionService struct {
	Queries       *db.Queries
	BytesPerToken int
}

func (ss *SessionService) Create(userID int32) (string, error) {
	fmt.Println("Create Session: ", userID)
	bytesPerToken := ss.BytesPerToken
	if bytesPerToken < MinBytesPerToken {
		bytesPerToken = MinBytesPerToken
	}

	token, err := rand.String(bytesPerToken)
	if err != nil {
		return "", fmt.Errorf("create: %w", err)
	}
	// CreateSession updates the token_hash if there is an existing session for the user.
	_, err = ss.Queries.CreateSession(context.Background(), db.CreateSessionParams{
		UserID:    userID,
		TokenHash: ss.hash(token),
	})

	if err != nil {
		return "", fmt.Errorf("create: %w", err)
	}
	return token, nil
}

func (ss *SessionService) User(token string) (*db.GetUserBySessionTokenRow, error) {
	tokenHash := ss.hash(token)
	user, err := ss.Queries.GetUserBySessionToken(context.Background(), tokenHash)
	if err != nil {
		return nil, fmt.Errorf("user: %w", err)
	}
	return &user, nil
}

func (ss *SessionService) Delete(token string) error {
	tokenHash := ss.hash(token)
	err := ss.Queries.DeleteSession(context.Background(), tokenHash)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}

func (ss *SessionService) hash(token string) string {
	tokenHash := sha256.Sum256([]byte(token))
	return base64.URLEncoding.EncodeToString(tokenHash[:])
}
