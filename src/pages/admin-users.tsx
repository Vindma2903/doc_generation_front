import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import "@/shared/styles/globals.css";
import DynamicBreadcrumbs from "@/shared/ui/common/Breadcrumb";
import UniversalTable from "@/shared/ui/common/table-projects.tsx";
import UsersAction from "@/shared/ui/common/users-action";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext"; // Импортируем useAuth

const columns = [
  { name: "ID", uid: "id", sortable: false },
  { name: "Имя пользователя", uid: "username", sortable: true },
  { name: "E-mail", uid: "email", sortable: true },
  { name: "Дата регистрации", uid: "registrationDate", sortable: true },
  { name: "Роль пользователя", uid: "role", sortable: true },
  { name: "Статус", uid: "status", sortable: true },
  { name: "Действия", uid: "actions", sortable: false },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, checkAuth } = useAuth(); // Используем авторизационные данные
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 🔥 Функция загрузки пользователей
  const fetchUsers = async () => {
    console.log("🚀 Отправляем запрос на /admin/get_all_users...");

    try {
      // 📌 Выводим `cookies` в консоль, чтобы проверить их наличие
      console.log("🔎 Текущие cookies:", document.cookie);

      let token = localStorage.getItem("access_token"); // Достаем токен из `localStorage`

      if (!token) {
        console.warn("⚠️ Токен отсутствует, проверяем авторизацию...");
        await checkAuth(); // Проверяем авторизацию, чтобы получить `token`
        token = localStorage.getItem("access_token"); // Пробуем взять токен заново
      }

      if (!token) {
        throw new Error("❌ Нет токена для авторизации запроса!");
      }

      console.log(`🔐 Используем токен: Bearer ${token}`);

      // 🔥 Делаем запрос с `Bearer token` + `cookies`
      const response = await axios.get("http://localhost:8000/admin/get_all_users", {
        withCredentials: true, // ОБЯЗАТЕЛЬНО! Передает cookies
        headers: {
          Authorization: `Bearer ${token}`, // Передаем токен в заголовке
        },
      });

      console.log("✅ Ответ от сервера:", response.data);

      const { users, last_updated } = response.data;
      if (lastUpdated !== last_updated) {
        setData(users);
        setLastUpdated(last_updated);
      }
      setFetchError(null);
    } catch (err: any) {
      console.error("❌ Ошибка при загрузке пользователей:", err.response || err.message);

      if (err.response?.status === 401) {
        setFetchError("Вы не авторизованы.");
        console.warn("⚠️ Ошибка 401, вызываем `checkAuth()`...");
        await checkAuth(); // Перепроверяем авторизацию
      } else if (err.response?.status === 403) {
        setFetchError("У вас нет прав администратора.");
        console.warn("🛑 Ошибка 403, перенаправляем на главную...");
        navigate("/"); // Перенаправляем не-админов
      } else {
        setFetchError("Не удалось загрузить пользователей. Попробуйте позже.");
      }
    }
  };

  // 🔄 Перенаправление на `/login`, если не авторизован или не админ
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login"); // Не авторизован — на страницу логина
      } else if (!user.isAdmin) {
        navigate("/"); // Не админ — на главную
      }
    }
  }, [loading, user, navigate]);

  // ⏳ Загружаем пользователей при переходе на `/admin-users`
  useEffect(() => {
    if (location.pathname === "/admin-users" && user?.isAdmin) {
      fetchUsers();
      const intervalId = setInterval(fetchUsers, 60000); // Обновляем данные каждые 60 секунд
      return () => clearInterval(intervalId);
    }
  }, [location.pathname, user, lastUpdated]);

  if (loading) {
    return <div>Загрузка...</div>; // Показываем загрузку, пока проверяется авторизация
  }

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content">
        <DynamicBreadcrumbs
          breadcrumbs={[
            { label: "Главная", to: "/" },
            { label: "Администрирование", to: "/admin" },
            { label: "Пользователи", to: "/admin-users" },
          ]}
        />
        <h1 className="content-title">Пользователи</h1>
        {fetchError && <p className="error-message">{fetchError}</p>}
        <UniversalTable
          columns={columns}
          data={data}
          renderCell={(item, columnKey) =>
            columnKey === "actions" ? (
              <img
                src="/public/actions.svg"
                alt="Actions"
                className="action-icon"
                onClick={() => {
                  setActiveUserId(item.id);
                  setIsActionOpen(true);
                }}
              />
            ) : (
              item[columnKey]
            )
          }
          emptyContent="Нет данных"
        />
        {isActionOpen && activeUserId && (
          <UsersAction
            isOpen={isActionOpen}
            onOpenChange={setIsActionOpen}
            onApprove={() => setIsActionOpen(false)}
            onReject={() => setIsActionOpen(false)}
            onBlock={() => setIsActionOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
