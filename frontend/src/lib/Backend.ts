import type { User } from "./Model";

interface ResponseData<Body extends Record<string, unknown>> { status: number; data: Body | null; error: string | null; };

class Backend {
  endpoints = {
    users: {
      create: "/api/users/create",
      login: "/api/users/login",
      logout: "/api/users/logout",
      me: "/api/users/me"
    }
  };
  defaultHeaders = {
    "Content-Type": "application/json",
  };
  authenticationInterval = 1000 * 60 * 15; // 15 minutes
  lastAuthenticatedTime: number = 0;
  user: User | null = null;

  async isAuthenticated(): Promise<User | null> {
    const hasSessionCookie = document.cookie.includes("sitzplan_session");
    if (!hasSessionCookie) return null;

    if (this.isUserStillFresh()) return this.user;

    const raw = await fetch(this.endpoints.users.me, {
      method: "GET",
      headers: this.defaultHeaders,
    });
    const response = await this.response<User>(raw);
    if (response.error) {
      this.lastAuthenticatedTime = 0;
      // Delete the cookie
      document.cookie = "sitzplan_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return null;
    }
    this.lastAuthenticatedTime = Date.now();
    this.user = response.data;
    return response.data;
  }

  isUserStillFresh(): boolean {
    return this.user !== null && (Date.now() - this.lastAuthenticatedTime) < this.authenticationInterval;
  }

  async response<Body extends Record<string, unknown> = Record<string, unknown>>(res: Response): Promise<ResponseData<Body>> {
    switch (res.headers.get("Content-Type")) {
      case "application/json":
        const responseBody = await res.json().catch((error) => ({ status: res.status, data: null, error }));

        if (responseBody.error != null) {
          return {
            status: res.status,
            data: null,
            error: responseBody.error,
          }
        }
        return {
          status: res.status,
          data: responseBody,
          error: null,
        }
      default:
        return {
          status: res.status,
          data: null,
          error: null
        }
    }
  }

  async createUser(user: User): Promise<ResponseData<Partial<User>> | null> {
    try {
      const raw = await fetch(
        this.endpoints.users.create,
        {
          method: "POST",
          headers: this.defaultHeaders,
          body: JSON.stringify(user),
        },
      );
      return this.response(raw);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error creating user: ", e.message);
      }
      return null;
    }
  }

  async loginUser(
    user: User,
  ): Promise<ResponseData<Partial<User>> | null> {
    try {
      const raw = await fetch(this.endpoints.users.login, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(user),
      });

      return this.response(raw);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error logging user in: ", e.message);
      }
      return null;
    }
  }

  async logoutUser(): Promise<ResponseData<any> | null> {
    try {
      const raw = await fetch(this.endpoints.users.logout, {
        method: "DELETE",
        headers: this.defaultHeaders,
      });
      return this.response(raw);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error logging user out: ", e.message);
      }
      return null;
    }
  }
}



export const backend = new Backend();