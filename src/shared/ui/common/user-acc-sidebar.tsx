import React, { useState } from "react";

const UserAccSidebar: React.FC<{ onTabChange: (tab: string) => void }> = React.memo(({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("profile"); // По умолчанию активна вкладка "Профиль"

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab); // Уведомляем родительский компонент о смене вкладки
  };

  return (
    <aside className="user-sidebar">
      <div className="user-sidebar-container">

        <nav className="user-menu-links">
          <button
            onClick={() => handleTabClick("profile")}
            className={`user-menu-link ${
              activeTab === "profile" ? "user-menu-link-active" : ""
            }`}
          >
            <img
              src="/user-icon.svg"
              alt="Профиль"
              className="user-menu-icon"
            />
            Профиль
          </button>
          <button
            onClick={() => handleTabClick("security")}
            className={`user-menu-link ${
              activeTab === "security" ? "user-menu-link-active" : ""
            }`}
          >
            <img
              src="/public/setting-icon.svg"
              alt="Безопасность"
              className="user-menu-icon"
            />
            Безопасность
          </button>
        </nav>
      </div>
    </aside>
  );
});

export { UserAccSidebar };
