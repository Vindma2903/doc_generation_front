import React from "react";
import { useNavigate } from "react-router-dom"; // Хук для навигации
import "@/shared/styles/projects.css"; // Подключаем стили
import "@/shared/styles/globals.css"; // Подключаем стили

export const NavCRM: React.FC = () => {
  const navigate = useNavigate(); // Хук для перехода между страницами

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "80px",
        background: "#fff",
        borderLeft: "1px solid #D8D8D8", // Добавляем обводку вместо тени
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        gap: "24px",
        zIndex: 1001,
      }}
    >
      {/* Кнопка уведомлений */}
      <button
        style={{
          width: "40px",
          height: "40px",
          background: "#f5f5f5",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #D8D8D8", // Обводка кнопки
          cursor: "pointer",
        }}
      >
        <img
          src="/bell.svg"
          alt="Уведомления"
          style={{ width: "24px", height: "24px" }}
        />
      </button>

      {/* Кнопка перехода на страницу dialog-user */}
      <button
        onClick={() => navigate("/dialog-user")} // Переход на /dialog-user
        style={{
          width: "40px",
          height: "40px",
          background: "#f5f5f5",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #D8D8D8", // Обводка кнопки
          cursor: "pointer",
        }}
      >
        <img
          src="/message.svg" // Путь к новой иконке
          alt="Сообщения"
          style={{ width: "24px", height: "24px" }}
        />
      </button>
    </div>
  );
};
