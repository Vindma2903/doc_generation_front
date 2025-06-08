import React, { useEffect, useState } from "react";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import "@/shared/styles/home.css";
import "@/shared/styles/globals.css";
import axios from "axios";
import { getUserIdFromToken } from "@/features/auth/AuthContext";

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

const CreateTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

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

  const handleCreate = async () => {
    const userId = getUserIdFromToken(); // <-- извлекаем user_id из токена
    if (!userId || !templateName.trim()) {
      alert("Введите название шаблона");
      return;
    }

    const payload = {
      user_id: userId,
      name: templateName.trim(),
      content: "",
    };

    console.log("📤 Отправка данных на сервер:", payload);

    try {
      const response = await axios.post("http://localhost:8080/templates/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      console.log("✅ Ответ от сервера:", response.data);

      setShowModal(false);
      setTemplateName("");

      const res = await axios.get("http://localhost:8080/templates/all");
      setTemplates(res.data);
    } catch (error: any) {
      console.error("❌ Ошибка при создании шаблона:", error);
      alert(`Не удалось создать шаблон\n${error?.response?.data?.error || error.message}`);
    }
  };


  return (
    <div className="home-container">
      <MainSidebar />

      <main className="content" style={{ padding: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Создание шаблонов
        </h1>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#0070f3",
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
            <tr key={template.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={cellStyle}>{template.name}</td>
              <td style={cellStyle}>
                {template.creator.first_name} {template.creator.last_name}
              </td>
              <td style={cellStyle}>{formatDateTime(template.created_at)}</td>
              <td style={cellStyle}>
                <button
                  title="Действия"
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
              <h2 style={{ marginBottom: "12px" }}>Создать шаблон</h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Введите название шаблона"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={() => setShowModal(false)}>Отмена</button>
                <button
                  onClick={handleCreate}
                  style={{
                    backgroundColor: "#0070f3",
                    color: "#fff",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "4px",
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
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

export default CreateTemplatesPage;
