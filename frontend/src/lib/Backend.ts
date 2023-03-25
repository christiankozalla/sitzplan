import type { User } from "./Model";

class Backend {
  baseUrl: null | string;
  defaultHeaders = {
    "Content-Type": "application/json",
  };
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createUser(user: User): Promise<Pick<User, "ID" | "Email"> | null> {
    try {
      const response: Pick<User, "ID" | "Email"> = await fetch(
        `${this.baseUrl}/users/create`,
        {
          method: "POST",
          headers: this.defaultHeaders,
          body: JSON.stringify(user),
        },
      ).then((res) => {
        if (res.ok || res.status < 299) {
          return res.json();
        }
        return null;
      });

      return response;
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error creating user: ", e.message);
        return null;
      }
      return null;
    }
  }

  async loginUser(
    user: Pick<User, "Email" | "Password">,
  ): Promise<User | null> {
    try {
      const response: User = await fetch(`${this.baseUrl}/users/login`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(user),
      }).then((res) => {
        if (res.ok || res.status < 299) {
          return res.json();
        }
        return null;
      });

      return response;
    } catch (e) {
      console.log(JSON.stringify(e));
      return null;
    }
  }
}

export const backend = new Backend(import.meta.env.VITE_BACKEND_BASE_URL);
