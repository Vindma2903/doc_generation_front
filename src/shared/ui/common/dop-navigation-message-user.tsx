import React from "react";
import { useNavigate } from "react-router-dom"; // Хук для навигации

export const NavCRM: React.FC = () => {
  const navigate = useNavigate(); // Хук для перехода между страницами

  const handleCloseClick = () => {
    navigate("/crm"); // Перенаправление на страницу /crm
  };

  return (
    <div className="dop-navigation-message-container">
      {/* Кнопка закрыть */}
      <button className="dop-navigation-close-button" onClick={handleCloseClick}>
        <img src="/close.svg" alt="Закрыть" className="dop-navigation-close-icon" />
      </button>

      {/* Кнопка уведомлений */}
      <button className="dop-navigation-message-button">
        <img src="/bell.svg" alt="Уведомления" className="dop-navigation-message-icon" />
      </button>

      {/* Кнопка перехода на страницу dialog-user */}
      <button
        className="dop-navigation-message-button"
        onClick={() => navigate("/dialog-user")}
      >
        <img src="/message.svg" alt="Сообщения" className="dop-navigation-message-icon" />
      </button>

      <style>
        {`
          .dop-navigation-message-container {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 80px;
            background: #fff;
            border-right: 1px solid #d8d8d8;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 0;
            gap: 24px;
          }

          .dop-navigation-close-button {
            width: 40px;
            height: 40px;
            background: #f5f5f5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d8d8d8;
            cursor: pointer;
          }

          .dop-navigation-close-button:hover {
            background: #e0e0e0; /* Цвет при наведении */
          }

          .dop-navigation-close-icon {
            width: 24px;
            height: 24px;
          }

          .dop-navigation-message-button {
            width: 40px;
            height: 40px;
            background: #f5f5f5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d8d8d8;
            cursor: pointer;
          }

          .dop-navigation-message-button:hover {
            background: #e0e0e0; /* Цвет при наведении */
          }

          .dop-navigation-message-icon {
            width: 24px;
            height: 24px;
          }
        `}
      </style>
    </div>
  );
};
