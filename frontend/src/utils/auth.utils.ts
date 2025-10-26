const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const authUtils = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUserData(): { userId: number; email: string } | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUserData(userId: number, email: string): void {
    localStorage.setItem(USER_KEY, JSON.stringify({ userId, email }));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};
