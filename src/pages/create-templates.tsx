import React, { useEffect, useState } from "react";
import { MainSidebar } from "@/shared/ui/common/main-sidebar";
import "@/shared/styles/globals.css";
import axios from "axios";
import { getUserIdFromToken } from "@/features/auth/AuthContext";
import { Button } from "@/shared/ui/common/global/btn";

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
    const userId = getUserIdFromToken();
    if (!userId || !templateName.trim()) {
      alert("Введите название шаблона");
      return;
    }

    const payload = {
      user_id: userId,
      name: templateName.trim(),
      content: "",
    };

    try {
      await axios.post("http://localhost:8080/templates/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      setShowModal(false);
      setTemplateName("");

      const res = await axios.get("http://localhost:8080/templates/all");
      setTemplates(res.data);
    } catch (error: any) {
      console.error("Ошибка при создании шаблона:", error);
      alert(`Не удалось создать шаблон\n${error?.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content create-templates">
        <h1 className="page-title">Создание шаблонов</h1>

        <div className="template-actions">
          <Button onClick={() => setShowModal(true)} className="btn-create-template">
            Создать шаблон
          </Button>
        </div>

        <table className="template-table">
          <thead>
          <tr>
            <th>Название шаблона</th>
            <th>Создатель</th>
            <th>Дата и время создания</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.name}</td>
              <td>
                {template.creator.first_name} {template.creator.last_name}
              </td>
              <td>{formatDateTime(template.created_at)}</td>
              <td>
                <button className="table-action-btn" title="Действия">⋮</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Создать шаблон</h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Введите название шаблона"
              />
              <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>Отмена</button>
                <Button onClick={handleCreate}>Создать</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateTemplatesPage;
