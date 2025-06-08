import React from "react";
import { Navigate } from "react-router-dom"; // 🔥 Для редиректа
import { useAuth } from "@/features/auth/AuthContext";
import "@/shared/styles/projects.css";
import "@/shared/styles/globals.css";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import Breadcrumbs from "@/shared/ui/common/Breadcrumb";
import { BoardCRM } from "@/shared/ui/crm/board-crm";
import { NavCRM } from "@/shared/ui/crm/nav-crm";

export const CRMPage: React.FC = () => {
  const { user, loading } = useAuth(); // Получаем пользователя и статус загрузки

  // 🔄 Показываем "Загрузка..." пока проверяется авторизация
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // ❌ Если пользователь не авторизован, перенаправляем его на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const breadcrumbs = [
    { label: "Главная", to: "/" },
    { label: "CRM", to: "/crm" },
    { label: "Ваши сделки", to: "/projects" },
  ];

  return (
    <div className="home-container" style={{ display: "flex", position: "relative" }}>
      {/* Боковое меню */}
      <MainSidebar />

      {/* Контентная часть */}
      <main className="content" style={{ flex: 1, paddingRight: "100px" }}>
        {/* Хлебные крошки */}
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Заголовок */}
        <h2 className="content-title">Ваши сделки</h2>

        {/* Доска CRM */}
        <div className="board-crm-container">
          <BoardCRM />
        </div>
      </main>

      {/* Боковое меню CRM */}
      <NavCRM />
    </div>
  );
};

export default CRMPage;
