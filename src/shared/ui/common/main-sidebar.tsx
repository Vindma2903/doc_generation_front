import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserProfile } from "@/shared/ui/common/UserProfile";

const MainSidebar: React.FC = React.memo(() => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="menu-header">
          <img src="/logo.svg" alt="Логотип" className="menu-logo" />
          <button className="burger-button" aria-label="Меню">
            <img src="/burger.svg" alt="Бургер" className="burger-icon" />
          </button>
        </div>
        <nav className="menu-links">

          <Link
            to="/tags"
            className={`menu-link subtitle ${isActive("/tags") ? "active" : ""}`}
          >
            <img src="public/document/document.svg" alt="Теги" className="menu-icon icon" />
            Теги
          </Link>


          <Link
            to="/document-template"
            className={`menu-link subtitle ${isActive("/document-template") ? "active" : ""}`}
          >
            <img src="public/document/template.svg" alt="Шаблоны" className="menu-icon icon" />
            Шаблоны
          </Link>


          <Link
            to="/documents"
            className={`menu-link subtitle ${isActive("/documents") ? "active" : ""}`}
          >
            <img src="public/document/document.svg" alt="Документы" className="menu-icon icon" />
            Документы
          </Link>


        </nav>
        <UserProfile />
      </div>
    </aside>
  );
});

export { MainSidebar };
