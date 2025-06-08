import React, { useState, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "@/shared/ui/common/task-crm";
import { fetchDeals, createDeal } from "@/shared/api/crm"; // API-запросы
import "@/shared/styles/kanban.css";

interface Deal {
  id: string;
  name: string;           // Название сделки
  timeAgo: string;
  amount: number;
  client_name: string;
  client_phone: string;
  columnId: string;
  createdAt: Date;
}

interface ColumnProps {
  id: string;             // Значение, которое используется как column_id
  title: string;
  onDealClick: (deal: Deal) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, onDealClick }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",         // Название сделки (обязательное)
    client_name: "",  // ФИО клиента (обязательное)
    client_phone: "", // Телефон клиента (обязательное)
    amount: 0,        // Сумма сделки
  });

  // Загрузка сделок при монтировании
  useEffect(() => {
    const loadDeals = async () => {
      try {
        const loadedDeals = await fetchDeals();
        const formattedDeals = loadedDeals.map((deal: any) => ({
          ...deal,
          amount: deal.price || 0,
        }));
        // Фильтруем сделки по columnId
        setDeals(formattedDeals.filter((deal: any) => deal.columnId === id));
      } catch (error) {
        console.error("❌ Ошибка загрузки сделок:", error);
      }
    };

    loadDeals();
  }, [id]);

  // Обработка изменений в полях формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Валидация номера телефона (российский формат)
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phoneRegex.test(phone);
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверяем, что все обязательные поля заполнены
    if (!formData.name || !formData.client_name || !formData.client_phone || formData.amount <= 0) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    if (!validatePhoneNumber(formData.client_phone)) {
      alert("Введите корректный номер телефона!");
      return;
    }

    // Формируем объект данных в соответствии с OrderCreateSchema
    const newDealData = {
      name: formData.name,  // Название сделки
      description: null,
      date_of_creation: new Date().toISOString(),
      date_of_send: new Date().toISOString(),
      address: null,
      delivery_method: "COURIER",
      price: Number(formData.amount),
      column_id: id || "column-1",  // Если id не задан, используем "column-1"
      client_name: formData.client_name,
      client_phone: formData.client_phone,
    };

    // Логируем объект перед отправкой
    console.log("📤 Отправляем данные сделки:", JSON.stringify(newDealData, null, 2));

    try {
      const response = await createDeal(newDealData);
      if (response.status === "success") {
        const newDeal: Deal = {
          id: response.order.id,
          name: formData.name,
          timeAgo: "", // Можно добавить вычисление времени, если нужно
          amount: formData.amount,
          client_name: formData.client_name,
          client_phone: formData.client_phone,
          columnId: id || "column-1",
          createdAt: new Date().toISOString(),
        };

        setDeals((prevDeals) => [...prevDeals, newDeal]);
        setShowForm(false);
        setFormData({ name: "", client_name: "", client_phone: "", amount: 0 });
      }
    } catch (error: any) {
      alert("Ошибка при создании сделки!");
      console.error("❌ Ошибка создания сделки:", error);
      console.log("📌 Ответ сервера (полный):", JSON.stringify(error.response?.data, null, 2));
    }
  };

  // Вычисляем общую сумму сделок
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="column-wrapper">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <div className="deal-count">{deals.length}</div>
      </div>
      <p className="column-total">Сумма сделок: {totalAmount} ₽</p>

      <button className="crm-add-button" onClick={() => setShowForm(true)}>
        Добавить сделку
      </button>

      {showForm && (
        <form className="crm-form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Название сделки"
            value={formData.name}
            onChange={handleInputChange}
            className="crm-input"
          />
          <input
            type="text"
            name="client_name"
            placeholder="ФИО клиента"
            value={formData.client_name}
            onChange={handleInputChange}
            className="crm-input"
          />
          <input
            type="text"
            name="client_phone"
            placeholder="Телефон"
            value={formData.client_phone}
            onChange={handleInputChange}
            className="crm-input"
          />
          <input
            type="number"
            name="amount"
            placeholder="Сумма"
            value={formData.amount || ""}
            onChange={handleInputChange}
            className="crm-input"
          />
          <div className="crm-form-buttons">
            <button type="button" className="crm-cancel-button" onClick={() => setShowForm(false)}>
              Отмена
            </button>
            <button type="submit" className="crm-submit-button">
              Сохранить
            </button>
          </div>
        </form>
      )}

      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="crm-task-list">
            {deals.map((deal, index) => (
              <Task key={deal.id} taskData={deal} index={index} onClick={() => onDealClick(deal)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
