import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserProfile } from "@/shared/ui/common/UserProfile";

const MainSidebarComponent: React.FC = () => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
            <img src="/partner.svg" alt="Контрагенты" className="menu-icon icon" />
            Контрагенты
          </Link>

          <Link
            to="/user-page"
            className={`menu-link subtitle ${isActive("/user-page") ? "active" : ""}`}
          >
            <img src="/users.svg" alt="Пользователи" className="menu-icon icon" />
            Пользователи
          </Link>

          {/* Настройки с выпадающим списком */}
          <div className="menu-link-group">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`menu-link subtitle flex items-center justify-between w-full ${isActive("/settings") || isActive("/access-rights") ? "active" : ""}`}
            >
              <div className="flex items-center gap-2">
                <img src="/setting.svg" alt="Настройки" className="menu-icon icon" />
                Настройки
              </div>
              <img
                src={settingsOpen ? "/chevron-up.svg" : "/chevron-down.svg"}
                alt="Раскрыть"
                className="w-4 h-4 opacity-60"
              />
            </button>

            {settingsOpen && (
              <div className="sidebar-submenu-wrapper">
                <div className="sidebar-submenu-line" />

                <Link
                  to="/access-rights"
                  className={`sidebar-submenu-link ${isActive("/access-rights") ? "active" : ""}`}
                >
                  Права доступа
                </Link>
              </div>
            )}


          </div>
        </nav>

        <UserProfile />
      </div>
    </aside>
  );
};

export const MainSidebar = React.memo(MainSidebarComponent);
