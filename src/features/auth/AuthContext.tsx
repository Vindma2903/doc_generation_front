import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { Skeleton } from "@/shared/ui/common/auth/Skeleton";
import { Card, CardContent } from "@/shared/ui/common/auth/Card";
import { Loader2 } from "lucide-react";

// Интерфейс пользователя
interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  role: string;
  isAdmin: boolean;
}

// Интерфейс контекста авторизации
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

// Контекст авторизации
const AuthContext = createContext<AuthContextType | null>(null);

// Декодер JWT
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.user_id || null;
};

// Провайдер авторизации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get<{ status: string; user: User }>(
        "http://127.0.0.1:8080/auth/check",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      if (response.data.status === "authorized") {
        setUser({
          ...response.data.user,
          isAdmin: response.data.user.role === "admin",
        });
        return;
      }

      throw new Error("Unauthorized");
    } catch {
      try {
        const refreshResponse = await axios.post<{ access_token: string }>(
          "http://127.0.0.1:8080/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.access_token;
        localStorage.setItem("access_token", newToken);
        return await checkAuth();
      } catch {
        setUser(null);
        localStorage.removeItem("access_token");
      }
    } finally {
      setLoading(false);
    }
  };

  // При загрузке страницы — проверка токена
  useEffect(() => {
    checkAuth();
  }, []);

  // Защита маршрутов — только если не на публичной странице
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/forgot-password", "/confirm-register", "/set-password"];
    const isPublic = publicPaths.includes(location.pathname);

    if (!loading && !user && !isPublic) {
      navigate("/login");
    }
  }, [loading, user, navigate, location]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {!loading ? (
        children
      ) : (
        <div className="auth-page">
          <Card className="auth-card">
            <CardContent>
              <div className="auth-loader">
                <Loader2 className="spinner" />
                <Skeleton className="skeleton-line w-3/4" />
                <Skeleton className="skeleton-line w-2/3" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Хук доступа к контексту
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
