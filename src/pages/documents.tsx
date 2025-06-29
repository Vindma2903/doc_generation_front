import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import { useAuth } from "@/features/auth/AuthContext";
import { DataTable } from "@/shared/ui/common/global/table";
import { getUserIdFromToken } from "@/features/auth/AuthContext";
import "@/shared/styles/globals.css";

interface Document {
  id: number;
  name: string;
  user_id: number;
  template_id: number;
  content: string;
  rendered_content: string | null;
  created_at: string;
}

export const DocumentsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDocs = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/documents/user/${user.id}`);
        setDocuments(res.data);
        setFilteredDocs(res.data);
      } catch (err) {
        console.error("Ошибка загрузки документов:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchDocs();
  }, [user]);

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDocs(filtered);
  }, [searchQuery, documents]);

  const handleCreateDocument = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Пользователь не авторизован");
        return;
      }

      const response = await axios.post("http://localhost:8080/documents/create", {
        user_id: Number(userId),
        name: docName,
        template_id: 1, // временно жёстко, можно расширить
        content: "",
      });

      const newDocId = response.data?.id;
      if (!newDocId) throw new Error("Сервер не вернул ID нового документа");

      setShowModal(false);
      navigate(`/documents/fill/${newDocId}`);
    } catch (error) {
      console.error("Ошибка при создании документа:", error);
      alert("Не удалось создать документ");
    }
  };

  const columns = [
    { name: "Название", uid: "name", sortable: true },
    { name: "Дата создания", uid: "created_at", sortable: true },
    { name: "Шаблон", uid: "template_id" },
    { name: "Действия", uid: "actions", align: "center" },
  ];


  const renderCell = (doc: Document, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return doc.id;
      case "name":
        return doc.name;
      case "created_at":
        return new Date(doc.created_at).toLocaleString("ru-RU");
      case "template_id":
        return doc.template_id;
      case "actions":
        return (
          <button
            className="row-action"
            title="Открыть документ"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/documents/fill/${doc.id}`);
            }}
          >
            ⋮
          </button>
        );
      default:
        return null;
    }
  };

  if (loading || fetching) return <div>Загрузка...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content document-template">
        <h1 className="page-title">Мои документы</h1>

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
            Создать документ
          </button>
        </div>

        <DataTable
          columns={columns}
          items={filteredDocs}
          renderCell={renderCell}
          onRowClick={(doc) => navigate(`/documents/fill/${doc.id}`)}
          ariaLabel="Таблица документов"
        />

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Создать документ</h2>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Название документа"
              />
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button className="confirm-button" onClick={handleCreateDocument}>
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
