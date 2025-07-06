import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserProfile } from "@/shared/ui/common/UserProfile";

const MainSidebarComponent: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="menu-header">
          <img src="/logo.svg" alt="Логотип" className="menu-logo" />
          <button className="burger-button" aria-label="Меню">
            <img src="/burger.svg" alt="Меню" className="burger-icon" />
          </button>
        </div>

        <nav className="menu-links">
          <Link
            to="/document-template"
            className={`menu-link subtitle ${isActive("/document-template") ? "active" : ""}`}
          >
            <img src="/document/template.svg" alt="Шаблоны" className="menu-icon icon" />
            Шаблоны
          </Link>

          <Link
            to="/documents"
            className={`menu-link subtitle ${isActive("/documents") ? "active" : ""}`}
          >
            <img src="/document/document.svg" alt="Документы" className="menu-icon icon" />
            Документы
          </Link>

          <Link
            to="/counterparties"
            className={`menu-link subtitle ${isActive("/counterparties") ? "active" : ""}`}
          >
            <img src="public/partner.svg" alt="Контрагенты" className="menu-icon icon" />
            Контрагенты
          </Link>

          {/* 👇 Добавлено: Добавление пользователей */}
          <Link
            to="/user-page"
            className={`menu-link subtitle ${isActive("/user-page") ? "active" : ""}`}
          >
            <img src="/users.svg" alt="Пользователи" className="menu-icon icon" />
            Пользователи
          </Link>



        </nav>

        <UserProfile />
      </div>
    </aside>
  );
};

// Оборачиваем в React.memo
export const MainSidebar = React.memo(MainSidebarComponent);
