import React from "react";
import { MainSidebar } from "@/shared/ui/common/project-sidebar"; // Боковое меню
import "@/shared/styles/globals.css"; // Глобальные стили
import "@/shared/styles/project-edits.css"; // Стили для страницы
import Breadcrumbs from "@/shared/ui/common/Breadcrumb"; // Хлебные крошки
import { useNavigate } from "react-router-dom"; // Хук навигации
import TableProjects from "@/shared/ui/common/table-projects"; // Импортируем таблицу

const ProjectEdits = () => {
  const navigate = useNavigate(); // Хук для навигации

  // Возврат на предыдущую страницу
  const handleBackClick = () => navigate(-1);

  return (
    <div className="home-container">
      {/* Боковое меню */}
      <MainSidebar />

      {/* Основной контент */}
      <main className="content">
        {/* Хлебные крошки */}
        <Breadcrumbs>
          <span onClick={handleBackClick} className="breadcrumb-back-arrow">
            ← Назад
          </span>
          <span>Название проекта</span>
        </Breadcrumbs>

        {/* Заголовок */}
        <h1 className="content-title">База знаний</h1>
      </main>
    </div>
  );
};

export default ProjectEdits;
