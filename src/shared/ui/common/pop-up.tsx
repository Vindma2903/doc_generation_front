import React, { useState } from "react";
import { Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";
import { Link } from "react-router-dom";

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu aria-label="Profile menu" variant="faded">
        {/* Информация о пользователе */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <img
            src="/user_photo.png"
            alt="User Avatar"
            className="rounded-full w-12 h-12"
          />
          <div>
            <div className="text-base font-semibold">Палагина Виктория</div>
            <div className="text-sm text-gray-500">v9023669439@gmail.com</div>
          </div>
        </div>

        {/* Настройки профиля */}
        <DropdownItem
          key="settings"
          startContent={
            <img
              src="/settings-icon.svg"
              alt="Настройки профиля"
              className={iconClasses}
              width={20}
              height={20}
            />
          }
        >
          <Link to="/profile-settings">Настройки профиля</Link>
        </DropdownItem>

        {/* Выход */}
        <DropdownItem
          key="logout"
          startContent={
            <img
              src="/logout-icon.svg"
              alt="Выход"
              className={iconClasses}
              width={20}
              height={20}
            />
          }
        >
          <Link to="/logout">Выход</Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
