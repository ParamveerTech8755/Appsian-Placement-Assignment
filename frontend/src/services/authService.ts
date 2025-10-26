import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from "../types/project.types";
import { authUtils } from "../utils/auth.utils";

const API_BASE_URL = "http://localhost:5000/api";

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Registration failed");
    }

    const data = await response.json();
    authUtils.setToken(data.token);
    authUtils.setUserData(data.userId, data.email);
    return data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    authUtils.setToken(data.token);
    authUtils.setUserData(data.userId, data.email);
    return data;
  },

  logout(): void {
    authUtils.removeToken();
  },
};
