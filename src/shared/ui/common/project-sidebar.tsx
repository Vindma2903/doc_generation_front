import React from "react";
import { Link } from "@nextui-org/react";
import { UserProfile } from "@/shared/ui/common/UserProfile";
import { useLocation } from "react-router-dom";

export const MainSidebar: React.FC = () => {
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
            href="/home"
            className={`menu-link subtitle ${isActive("/home") ? "active" : ""}`}
          >
            <img src="/constructor.svg" alt="Конструктор" className="menu-icon icon" />
            Конструктор
          </Link>
          <Link
  href="/project-edits"
  className={`menu-link subtitle ${isActive("/project-edits") ? "active" : ""}`}
>
  <img src="/setting.svg" alt="Основные настройки" className="menu-icon icon" />
  Основные настройки
</Link>
          <Link
  href="/knowledge-base"
  className={`menu-link subtitle ${isActive("/knowledge-base") ? "active" : ""}`}
>
  <img src="/book.svg" alt="База знаний" className="menu-icon icon" />
  База знаний
</Link>

          <Link
            href="/crm"
            className={`menu-link subtitle ${isActive("/crm") ? "active" : ""}`}
          >
            <img src="/product.svg" alt="Товары и услуги" className="menu-icon icon" />
            Товары и услуги
          </Link>
          <Link
            href="/pricing"
            className={`menu-link subtitle ${isActive("/pricing") ? "active" : ""}`}
          >
            <img src="/integration.svg" alt="Интеграции" className="menu-icon icon" />
            Интеграции
          </Link>
        </nav>

        <UserProfile />
      </div>
    </aside>
  );
};
