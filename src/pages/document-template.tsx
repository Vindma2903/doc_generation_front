import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import "@/shared/styles/globals.css";
import axios from "axios";
import { getUserIdFromToken } from "@/features/auth/AuthContext";
import { DataTable } from "@/shared/ui/common/global/table";
import { SortDescriptor } from "@heroui/react";

interface Template {
  id: number;
  name: string;
  created_at: string;
  creator: {
    first_name: string;
    last_name: string;
  };
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DocumentTemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:8080/templates/all");
        setTemplates(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке шаблонов:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateTemplate = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Пользователь не авторизован");
        return;
      }

      const response = await axios.post("http://localhost:8080/templates/create", {
        user_id: Number(userId),
        name: templateName,
        content: "",
      });

      const newTemplateId = response.data?.id;
      if (!newTemplateId) throw new Error("Сервер не вернул ID нового шаблона");

      setShowModal(false);
      navigate(`/edit-template/${newTemplateId}`);
    } catch (error) {
      console.error("Ошибка при создании шаблона:", error);
      alert("Не удалось создать шаблон");
    }
  };

  const columns = [
    { name: "Название шаблона", uid: "name", sortable: true },
    { name: "Создатель", uid: "creator" },
    { name: "Дата и время создания", uid: "created_at", sortable: true },
    { name: "Действия", uid: "actions", align: "center" },
  ];

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    if (!column) return 0;

    let aValue = a[column as keyof Template];
    let bValue = b[column as keyof Template];

    if (column === "created_at") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    const compare =
      typeof aValue === "number" && typeof bValue === "number"
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));

    return direction === "descending" ? -compare : compare;
  });

  const renderCell = (template: Template, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return template.name;
      case "creator":
        return `${template.creator.first_name} ${template.creator.last_name}`;
      case "created_at":
        return formatDateTime(template.created_at);
      case "actions":
        return (
          <button
            className="row-action"
            title="Действия"
            onClick={(e) => e.stopPropagation()}
          >
            ⋮
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content document-template">
        <h1 className="page-title">Шаблоны документов</h1>

        <div className="template-actions">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="template-search"
            />
            <img src="/search.svg" alt="Поиск" className="search-icon" />
          </div>

          <button className="create-button" onClick={() => setShowModal(true)}>
            Создать шаблон
          </button>
        </div>

        <DataTable
          columns={columns}
          items={sortedTemplates}
          renderCell={renderCell}
          onRowClick={(template) => navigate(`/edit-template/${template.id}`)}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        />

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Создать шаблон</h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Название шаблона"
              />
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button className="confirm-button" onClick={handleCreateTemplate}>
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentTemplatePage;
