import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import type { LoginDto, RegisterDto } from "../types/project.types";
import { authUtils } from "../utils/auth.utils";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (dto: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(dto);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(dto);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    navigate("/login");
  };

  const isAuthenticated = authUtils.isAuthenticated();
  const user = authUtils.getUserData();

  return { login, register, logout, loading, error, isAuthenticated, user };
};
