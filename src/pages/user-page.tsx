import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/shared/styles/globals.css";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import { useAuth } from "@/features/auth/AuthContext";
import { DataTable } from "@/shared/ui/common/global/table";
import { Button } from "@/shared/ui/common/global/btn";
import UserDrawer from "@/shared/ui/common/global/drawer";

type User = {
  id: number;
  fullName: string;
  registrationDate: string;
  role: string;
  status: string;
  email: string;
};

const AddUserPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      if (!Array.isArray(rawData)) {
        throw new Error("Некорректный формат данных");
      }

      const mapped: User[] = rawData.map((u: any) => ({
        id: u.ID,
        fullName: `${u.LastName} ${u.FirstName}`,
        registrationDate: new Date().toISOString(), // или u.CreatedAt, если есть
        role: u.Role || (u.IsOwner ? "Владелец" : "Сотрудник"),
        status: u.EmailVerified ? "Активен" : "Ожидает подтверждения",
        email: u.Email,
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
    if (columnKey === "actions") {
      return (
        <button className="action-icon-btn" title="Действия">
          <img src="/actions.svg" alt="Действия" className="w-5 h-5" />
        </button>
      );
    }

    if (columnKey === "registrationDate") {
      const date = new Date(item.registrationDate);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    if (columnKey === "email") {
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
    }

    return item[columnKey as keyof User];
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

            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-primary small"
            >
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
            fetchUsers(); // обновим после добавления
          }}
        />
      </main>
    </div>
  );
};

export default AddUserPage;
