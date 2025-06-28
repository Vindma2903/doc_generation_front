import React, { useState } from "react";
import { Button, Card } from "@heroui/react";
import PopUp from "@/shared/ui/common/pop-up"; // Импортируем компонент модального окна

export const MainCards: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false); // Состояние для управления модальным окном

  // Функция для открытия и закрытия модального окна
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="cards-container">
      {/* Первая карточка */}
      <Card className="content-card">
        <div className="card-content">
          <div className="card-row">
            <div className="card-number">1</div>
            <div className="card-text">Создайте AI агента, укажите название</div>
          </div>
          <Button className="card-button" onPress={openModal}>
            Создать бота
          </Button>
        </div>
      </Card>

      {/* Модальное окно */}
      {isModalOpen && (
        <PopUp isOpen={isModalOpen} onClose={closeModal} />
      )}

      {/* Вторая карточка */}
      <Card className="content-card small-card">
        <div className="card-content">
          <div className="card-row">
            <div className="card-number">2</div>
            <div className="card-text">Настройте интеграцию с мессенджерами</div>
          </div>
        </div>
      </Card>

      {/* Третья карточка */}
      <Card className="content-card small-card">
        <div className="card-content">
          <div className="card-row">
            <div className="card-number">3</div>
            <div className="card-text">Начните обработку сообщений</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
