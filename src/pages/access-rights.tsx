import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import { UserRoleMatrix } from "@/shared/ui/common/global/user-role";
import { Button } from "@/shared/ui/common/global/btn";
import { AddRolePopup } from "@/shared/ui/common/global/add-role-pop";
import "@/shared/styles/globals.css";

// Типы
type Role = "Сотрудник" | "Администратор" | "Владелец";
type Permissions = Record<Role, Record<string, boolean>>;

const AccessRightsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  const roles: Role[] = ["Сотрудник", "Администратор", "Владелец"];

  const permissions: Permissions = {
    Владелец: {
      "Создание шаблонов": true,
      "Редактирование шаблонов": true,
      "Удаление шаблонов": true,
      Чтение: true,
      Добавление: true,
      Изменение: true,
      Удаление: true,
      Импорт: true,
      Экспорт: true,
    },
    Администратор: {
      "Создание шаблонов": true,
      "Редактирование шаблонов": true,
      "Удаление шаблонов": false,
      Чтение: true,
      Добавление: true,
      Изменение: true,
      Удаление: true,
      Импорт: true,
      Экспорт: true,
    },
    Сотрудник: {
      "Создание шаблонов": false,
      "Редактирование шаблонов": false,
      "Удаление шаблонов": false,
      Чтение: true,
      Добавление: false,
      Изменение: false,
      Удаление: false,
      Импорт: false,
      Экспорт: false,
    },
  };

  // Обработчик сохранения новой роли
  const handleSaveRole = (roleName: string, users: string[]) => {
    console.log("Новая роль:", roleName);
    console.log("Назначенные пользователи:", users);
    // Здесь можно добавить логику API для сохранения роли
    setIsPopupOpen(false);
  };

  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content">
        <h1 className="page-title mb-6">Права доступа</h1>

        <div className="card">
          {/* Кнопка — правый верхний угол */}
          <div className="flex justify-end mb-[24px]">
            <Button className="bg-primary small" onClick={() => setIsPopupOpen(true)}>
              Добавить новую роль
            </Button>
          </div>

          {/* Матрица прав */}
          <UserRoleMatrix roles={roles} permissions={permissions} />
        </div>
      </main>

      {/* Попап добавления роли */}
      <AddRolePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default AccessRightsPage;
