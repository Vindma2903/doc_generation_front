import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/shared/styles/globals.css";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import { useAuth } from "@/features/auth/AuthContext";
import { DataTable } from "@/shared/ui/common/global/table";
import { Button } from "@/shared/ui/common/global/btn";
import UserDrawer from "@/shared/ui/common/global/drawer";
import { ActionsDropdown } from "@/shared/ui/common/global/user-actions";
import { RoleChangePopup } from "@/shared/ui/common/global/role-change-pop"; // 👈 Подключаем модалку

type User = {
  id: number;
  fullName: string;
  registrationDate: string;
  role: string;
  status: string;
  email: string;
  isBlocked: boolean;
};

const AddUserPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 👈 для смены роли

  useEffect(() => {
    if (!loading && user) {
      fetchUsers();
    }
  }, [loading, user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8080/users/invited", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawData = await response.json();

      if (!Array.isArray(rawData)) throw new Error("Некорректный формат данных");

      const mapped: User[] = rawData.map((u: any) => ({
        id: u.ID,
        fullName: `${u.LastName} ${u.FirstName}`,
        registrationDate: u.CreatedAt || new Date().toISOString(),
        role: u.Role || (u.IsOwner ? "Владелец" : "Сотрудник"),
        status: u.IsBlocked
          ? "Заблокирован"
          : u.EmailVerified
            ? "Активен"
            : "Ожидает подтверждения",
        email: u.Email,
        isBlocked: u.IsBlocked,
      }));

      setUsers(mapped);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleBlock = async (user: User) => {
    const action = user.isBlocked ? "разблокировать" : "заблокировать";
    const endpoint = user.isBlocked ? "unblock" : "block";
    const confirmed = confirm(`Вы действительно хотите ${action} ${user.fullName}?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`http://localhost:8080/users/${user.id}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Ошибка при попытке ${action} пользователя`);
      }

      console.log(`✅ Пользователь ${user.fullName} ${action} успешно`);
      fetchUsers();
    } catch (error) {
      console.error("❌ Ошибка:", error);
      alert(`Ошибка: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (user: User) => {
    const confirmed = confirm(`Вы уверены, что хотите удалить ${user.fullName}?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Ошибка при удалении пользователя");
      }

      console.log(`🗑️ Пользователь ${user.fullName} удалён`);
      fetchUsers();
    } catch (error) {
      console.error("❌ Ошибка удаления:", error);
      alert(`Ошибка: ${(error as Error).message}`);
    }
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "ФИО", uid: "fullName", sortable: true },
    { name: "E-mail", uid: "email" },
    { name: "Дата регистрации", uid: "registrationDate", sortable: true },
    { name: "Роль пользователя", uid: "role" },
    { name: "Статус", uid: "status" },
    { name: "Действия", uid: "actions" },
  ];

  const renderCell = (item: User, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <ActionsDropdown
            onBlock={() => handleBlock(item)}
            onDelete={() => handleDelete(item)}
            onChangeRole={() => handleChangeRole(item)}
            isBlocked={item.isBlocked}
          />
        );
      case "registrationDate":
        return new Date(item.registrationDate).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      case "email":
        return (
          <div className="flex items-center gap-2">
            <span>{item.email}</span>
            <button
              onClick={() => navigator.clipboard.writeText(item.email)}
              title="Скопировать e-mail"
            >
              <img
                src="/copy.svg"
                alt="Скопировать"
                className="w-4 h-4 opacity-70 hover:opacity-100"
              />
            </button>
          </div>
        );
      default:
        return item[columnKey as keyof User];
    }
  };

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content">
        <h1 className="page-title mb-6">Пользователи</h1>

        <div className="card">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Поиск по ФИО"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded px-3 py-2 pl-10 text-sm"
              />
              <img
                src="/search.svg"
                alt="Поиск"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
              />
            </div>

            <Button onClick={() => setIsDrawerOpen(true)} className="bg-primary small">
              Добавить пользователя
            </Button>
          </div>

          <div className="table-wrapper mt-8">
            <DataTable<User>
              columns={columns}
              items={filteredUsers}
              renderCell={renderCell}
              itemsPerPage={5}
              ariaLabel="Список пользователей"
            />
          </div>
        </div>

        <UserDrawer
          isOpen={isDrawerOpen}
          onOpenChange={() => setIsDrawerOpen(!isDrawerOpen)}
          onClose={() => {
            setIsDrawerOpen(false);
            fetchUsers();
          }}
        />

        <RoleChangePopup
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSave={fetchUsers}
          user={
            selectedUser
              ? {
                id: selectedUser.id,
                fullName: selectedUser.fullName,
                email: selectedUser.email,
              }
              : null
          }
        />
      </main>
    </div>
  );
};

export default AddUserPage;
