import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

// Создаем контекст
const AuthContext = createContext<AuthContextType | null>(null);

// 🔓 JWT-декодер
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// 🔑 Получить user_id из токена
export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const payload = parseJwt(token);
  return payload?.user_id || null;
};

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // ✅ Функция проверки авторизации
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("🚀 Проверяем авторизацию (GET /auth/check)...");
      console.log("🔎 Access токен:", token);

      const response = await axios.get<{ status: string; user: User }>(
        "http://127.0.0.1:8080/auth/check",
        {
          withCredentials: true, // важно для работы с HttpOnly cookie
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
    } catch (error: any) {
      console.warn("🔁 Access токен истёк. Пытаемся обновить через refresh...");

      try {
        // ⚠️ Пытаемся обновить access токен
        const refreshResponse = await axios.post<{ access_token: string }>(
          "http://127.0.0.1:8080/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.access_token;
        localStorage.setItem("access_token", newToken);

        // Повторяем checkAuth после обновления токена
        return await checkAuth();
      } catch (refreshError) {
        console.error("❌ Ошибка при обновлении токена:", refreshError);
        setUser(null);
        localStorage.removeItem("access_token");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      console.warn("🔄 Перенаправляем на /login...");
      navigate("/login");
    }
  }, [loading, user, navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {!loading ? children : <div>Загрузка...</div>}
    </AuthContext.Provider>
  );
};

// ✅ Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
