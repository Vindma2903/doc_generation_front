import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import "@/shared/styles/globals.css";
import "@/shared/styles/document.css";
import axios from "axios";
import { getUserIdFromToken } from "@/features/auth/AuthContext"; // путь адаптируй под себя


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
      if (!newTemplateId) {
        throw new Error("Сервер не вернул ID нового шаблона");
      }

      setShowModal(false);
      navigate(`/edit-template/${newTemplateId}`);
    } catch (error) {
      console.error("Ошибка при создании шаблона:", error);
      alert("Не удалось создать шаблон");
    }
  };


  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content" style={{ padding: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Шаблоны документов
        </h1>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#615EF0",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Создать шаблон
          </button>
        </div>

        {/* Таблица */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={cellStyle}>Название шаблона</th>
            <th style={cellStyle}>Создатель</th>
            <th style={cellStyle}>Дата и время создания</th>
            <th style={cellStyle}>Действия</th>
          </tr>
          </thead>
          <tbody>
          {templates.map((template) => (
            <tr
              key={template.id}
              className="template-row"
              onClick={() => navigate(`/edit-template/${template.id}`)}
            >
              <td style={cellStyle}>{template.name}</td>
              <td style={cellStyle}>
                {template.creator.first_name} {template.creator.last_name}
              </td>
              <td style={cellStyle}>{formatDateTime(template.created_at)}</td>
              <td style={cellStyle}>
                <button
                  title="Действия"
                  onClick={(e) => e.stopPropagation()} // чтобы клик по кнопке не срабатывал на всю строку
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        {/* Модальное окно */}
        {showModal && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2 style={{ marginBottom: "12px", fontSize: "18px" }}>Создать шаблон</h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Название шаблона"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  border: "1px solid #E4E4E7",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#fff",
                    border: "1px solid #E4E4E7",
                    borderRadius: "4px",
                    color: "#333",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateTemplate}
                  style={{
                    backgroundColor: "#615EF0",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
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

const cellStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContent: React.CSSProperties = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "8px",
  width: "400px",
};

export default DocumentTemplatePage;
