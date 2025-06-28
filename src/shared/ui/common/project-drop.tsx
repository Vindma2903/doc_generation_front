import { Dropdown, DropdownMenu, DropdownItem, cn } from "@heroui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "@/shared/styles/globals.css"; // Подключаем стили
import PopUp from "@/shared/ui/common/delite-modal"; // Импортируем модальное окно удаления

export default function App() {
  const [isOpen, setIsOpen] = useState(false); // Для выпадающего меню
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Для модального окна удаления

  useEffect(() => {
    // Открываем меню сразу при загрузке компонента
    setIsOpen(true);
  }, []);

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // Функция для открытия модального окна удаления
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true); // Открываем модальное окно удаления
    setIsOpen(false); // Закрываем выпадающее меню
  };

  // Функция для закрытия модального окна удаления
  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false); // Закрываем модальное окно
    // Здесь можно добавить дополнительную логику для удаления проекта
  };

  // Функция для отмены удаления
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Закрываем модальное окно без удаления
  };

  return (
    <div>
      {/* Выпадающее меню */}
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
          {/* Редактировать */}
          <DropdownItem
            key="edit"
            startContent={
              <img
                src="/edit-icon.svg"
                alt="Редактировать"
                width={20}
                height={20}
                className={iconClasses}
              />
            }
          >
            <Link to="/project-edits">Редактировать</Link>
          </DropdownItem>

          {/* Удалить */}
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={
              <img
                src="/delite-icon.svg"
                alt="Удалить"
                width={20}
                height={20}
                className={cn(iconClasses, "text-danger")}
              />
            }
            onClick={handleDeleteClick} // Открываем модальное окно при клике
          >
            Удалить
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Модальное окно удаления */}
      <PopUp
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete} // Закрываем окно при отмене
        onConfirmDelete={handleConfirmDelete} // Передаем функцию для подтверждения удаления
      />
    </div>
  );
}