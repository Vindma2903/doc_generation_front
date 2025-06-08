import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "@/shared/ui/common/task-crm";
import "@/shared/styles/kanban.css";

interface Deal {
  id: string;
  title: string;
  timeAgo: string;
  amount: number;
  name: string;
  phone: string;
}

interface ColumnProps {
  id: string;
  deals?: Deal[];
  onAddDeal: (columnId: string, newDeal: Partial<Deal>) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, deals = [], onAddDeal }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: "",
    name: "",
    phone: "",
    amount: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddDeal = () => {
    if (!formData.title) {
      alert("Пожалуйста, укажите название сделки!");
      return;
    }

    onAddDeal(id, {
      ...formData,
      timeAgo: "только что",
      id: `deal-${Date.now()}-${Math.random()}`, // Генерируем уникальный id
    });

    setFormData({ title: "", name: "", phone: "", amount: 0 });
    setShowForm(false);
  };

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          className={`crm-task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <button className="crm-add-button" onClick={() => setShowForm(true)}>
            <img src="/plus.svg" alt="Добавить" className="crm-add-icon" />
            Добавить сделку
          </button>

          {showForm && (
            <div className="crm-form-container">
              <input
                type="text"
                name="title"
                placeholder="Название сделки"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="crm-input"
              />
              <input
                type="text"
                name="name"
                placeholder="ФИО клиента"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="crm-input"
              />
              <input
                type="text"
                name="phone"
                placeholder="Телефон"
                value={formData.phone || ""}
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
                <button
                  className="crm-cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Отмена
                </button>
                <button className="crm-submit-button" onClick={handleAddDeal}>
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {deals.map((deal, index) => (
            <Task key={deal.id} taskData={deal} index={index} />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
