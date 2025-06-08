import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<{ name: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/templates/${id}`);
        setTemplate(response.data);
      } catch (error) {
        console.error("Ошибка загрузки шаблона:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading) return <div>Загрузка шаблона...</div>;
  if (!template) return <div>Шаблон не найден</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Редактировать шаблон</h1>
      <div style={{ marginTop: "16px" }}>
        <strong>Название:</strong> {template.name}
      </div>
      <div style={{ marginTop: "16px" }}>
        <strong>Содержимое:</strong>
        <pre style={{ background: "#f5f5f5", padding: "12px" }}>{template.content || "Пусто"}</pre>
      </div>
      {/* Здесь можно добавить форму редактирования */}
    </div>
  );
};

export default EditTemplatePage;
