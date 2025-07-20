import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import { UserRoleMatrix } from "@/shared/ui/common/global/user-role";
import { Button } from "@/shared/ui/common/global/btn";
import { AddRolePopup } from "@/shared/ui/common/global/add-role-pop";
import axios from "axios";
import "@/shared/styles/globals.css";

type Role = string;
type Permissions = Record<Role, Record<string, boolean>>;

const defaultPermissions = {
  "Создание шаблонов": false,
  "Редактирование шаблонов": false,
  "Удаление шаблонов": false,
  Чтение: true,
  Добавление: false,
  Изменение: false,
  Удаление: false,
  Импорт: false,
  Экспорт: false,
};

const AccessRightsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const roleList: { id: number; name: string }[] = res.data;
        const roleNames = roleList.map((r) => r.name);

        setRoles(roleNames);

        const updatedPermissions: Permissions = {};
        roleNames.forEach((role) => {
          updatedPermissions[role] = permissions[role] || { ...defaultPermissions };
        });
        setPermissions(updatedPermissions);
      } catch (error) {
        console.error("Ошибка при получении ролей:", error);
      }
    };

    fetchRoles();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  // ➕ Добавление новой роли
  const handleSaveRole = async (roleName: string, userIds: number[]) => {
    try {
      await axios.post(
        "http://localhost:8080/users/assign-role",
        {
          role: roleName,
          user_ids: userIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!roles.includes(roleName)) {
        setRoles((prev) => [...prev, roleName]);
        setPermissions((prev) => ({
          ...prev,
          [roleName]: { ...defaultPermissions },
        }));
      }
    } catch (error) {
      console.error("Ошибка при назначении роли:", error);
    } finally {
      setIsPopupOpen(false);
    }
  };

  // ✏️ Переименование роли
  const handleRenameRole = async (oldName: string, newName: string) => {
    if (roles.includes(newName)) {
      alert("Роль с таким именем уже существует!");
      return;
    }

    setRoles((prev) => prev.map((r) => (r === oldName ? newName : r)));

    setPermissions((prev) => {
      const updated = { ...prev };
      updated[newName] = updated[oldName];
      delete updated[oldName];
      return updated;
    });

    try {
      await axios.post(
        "http://localhost:8080/roles/rename",
        {
          old_name: oldName,
          new_name: newName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Ошибка при переименовании роли:", error);
    }
  };

  // ❌ Удаление роли
  const handleDeleteRole = async (roleName: string) => {
    console.log("[Удаление роли] Инициировано удаление:", roleName);

    if (!window.confirm(`Удалить роль "${roleName}"?`)) {
      console.log("[Удаление роли] Отменено пользователем");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/roles/delete",
        { name: roleName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      console.log("[Удаление роли] Ответ от сервера:", response.data);

      setRoles((prev) => prev.filter((r) => r !== roleName));

      setPermissions((prev) => {
        const updated = { ...prev };
        delete updated[roleName];
        return updated;
      });

      console.log("[Удаление роли] Успешно удалено:", roleName);
    } catch (error: any) {
      console.error("[Удаление роли] Ошибка:", error);

      const message =
        error?.response?.data?.error || "Ошибка при удалении роли";
      alert(message);
    }
  };


  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content">
        <h1 className="page-title mb-6">Права доступа</h1>

        <div className="card">
          <div className="flex justify-end mb-6">
            <Button className="bg-primary small" onClick={() => setIsPopupOpen(true)}>
              Добавить новую роль
            </Button>
          </div>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: "100%", display: "inline-block" }}>
              <UserRoleMatrix
                roles={roles}
                permissions={permissions}
                onRenameRole={handleRenameRole}
                onDeleteRole={handleDeleteRole}
              />
            </div>
          </div>
        </div>
      </main>

      <AddRolePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default AccessRightsPage;
