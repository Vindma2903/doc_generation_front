import React from "react";
import { useNavigate } from "react-router-dom";
import "@/shared/styles/globals.css"; // Подключаем стили
import { MainSidebar } from "@/shared/ui/common/main-sidebar"; // Импортируем боковое меню
import { useAuth } from "@/features/auth/AuthContext";


export const HomePage: React.FC = () => {
  const { user, loading } = useAuth(); // Используем контекст для получения пользователя
  const navigate = useNavigate();

  // Если идет загрузка данных, показываем "Загрузка..."
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    navigate("/login");
    return null; // Ничего не рендерим, чтобы избежать ошибок
  }

  return (
    <div className="home-container">
      {/* Боковое меню */}
      <MainSidebar />

      {/* Контентная часть */}
      <main className="content">

      </main>
    </div>
  );
};
