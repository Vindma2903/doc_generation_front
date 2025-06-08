import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Deal } from "./board-crm";
import "@/shared/styles/kanban.css";

interface TaskProps {
  taskData: Deal;
  index: number;
  onClick: () => void;
}

const getTimeAgo = (createdAt?: Date): string => {
  if (!createdAt || isNaN(new Date(createdAt).getTime())) {
    return "Неизвестно"; // ✅ Защита от ошибки
  }

  const now = new Date();
  const createdDate = new Date(createdAt); // ✅ Преобразуем в дату
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "только что";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} минут${minutes % 10 === 1 && minutes !== 11 ? "у" : minutes % 10 >= 2 && minutes % 10 <= 4 && (minutes < 10 || minutes > 20) ? "ы" : ""} назад`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} час${hours % 10 === 1 && hours !== 11 ? "" : hours % 10 >= 2 && hours % 10 <= 4 && (hours < 10 || hours > 20) ? "а" : "ов"} назад`;
  } else {
    return createdDate.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};


export const Task: React.FC<TaskProps> = ({ taskData, index, onClick }) => {
  const creatorName = taskData.creator || "Палагина Виктория";
  const timeAgo = getTimeAgo(taskData.createdAt);

  return (
    <Draggable draggableId={taskData.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-container ${snapshot.isDragging ? "task-dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
        >
          <h4 className="task-title">{taskData.title}</h4>
          <div className="task-info-group">
            <p className="task-info">{taskData.name}</p>
            <p className="task-info">{taskData.phone}</p>
            <p className="task-amount">{taskData.amount} ₽</p>
          </div>
          <div className="task-footer">
            <div className="user-info">
              <img
                src="/user_photo.png"
                alt="User"
                className="task-user-icon"
              />
              <span className="task-creator">{creatorName}</span>
            </div>
            <span className="task-time">{timeAgo}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};