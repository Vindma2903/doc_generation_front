import React, { useState } from "react";
import "@/shared/styles/projects.css"; // Подключаем стили
import "@/shared/styles/globals.css"; // Подключаем стили
import { MainSidebar } from "@/shared/ui/common/main-sidebar"; // Импортируем компонент MainSidebar
import TableProjects from "@/shared/ui/common/table-projects.tsx"; // Импортируем таблицу
import Breadcrumbs from "@/shared/ui/common/Breadcrumb"; // Импортируем хлебные крошки
import { Switch } from "@heroui/react"; // Для отображения переключателя статуса
import ProjectDrop from "@/shared/ui/common/project-drop"; // Импортируем ProjectDrop

const columns = [
  { name: "Статус", uid: "статус", sortable: false },
  { name: "ID", uid: "id", sortable: false },
  { name: "Название проекта", uid: "тариф", sortable: true },
  { name: "Отправлено сообщений", uid: "сообщения", sortable: true },
  { name: "Действия", uid: "действия" },
];

const initialData = [
  { id: "1", тариф: "Проект A", сообщения: 100, статус: true },
  { id: "2", тариф: "Проект B", сообщения: 200, статус: false },
  { id: "3", тариф: "Проект C", сообщения: 150, статус: true },
  { id: "4", тариф: "Проект D", сообщения: 50, статус: false },
];

export const ProjectsPage: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [searchValue, setSearchValue] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null); // Состояние для ProjectDrop

  const breadcrumbs = [
    { label: "Главная", to: "/" },
    { label: "Ваши проекты", to: "/projects" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.тариф.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "статус") {
      return (
        <Switch
          checked={item[columnKey]}
          onChange={() =>
            setData((prevData) =>
              prevData.map((el) =>
                el.id === item.id ? { ...el, статус: !el.статус } : el
              )
            )
          }
        />
      );
    }
    if (columnKey === "действия") {
      return (
        <img
          src="/public/actions.svg"
          alt="Actions"
          className="action-icon"
          onClick={() => setActiveProjectId(item.id)} // Устанавливаем ID активного проекта
        />
      );
    }
    return item[columnKey];
  };

  return (
    <div className="home-container">
      {/* Боковое меню */}
      <MainSidebar />

      {/* Контентная часть */}
      <main className="content">
        {/* Хлебные крошки */}
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Заголовок */}
        <h1 className="content-title">Ваши проекты</h1>

        {/* Контейнер для поиска и кнопки */}
        <div className="table-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Название проекта"
              value={searchValue}
              onChange={handleSearch}
              className="search-input"
            />
            <img src="/search.svg" alt="Поиск" className="search-icon" />
          </div>
          <button
            className="add-button"
            onClick={() => alert("Создание нового проекта")}
          >
            Создать проект
          </button>
        </div>

        {/* Таблица проектов */}
        <TableProjects
          columns={columns}
          data={filteredData}
          renderCell={renderCell}
          onRowClick={(item) => setActiveProjectId(item.id)} // Открываем ProjectDrop сразу
        />

        {/* ProjectDrop */}
        {activeProjectId && (
          <ProjectDrop
            projectId={activeProjectId} // Передаем ID активного проекта
            onClose={() => setActiveProjectId(null)} // Закрываем ProjectDrop
          />
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
