import { Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";
import { useState } from "react";
import "@/shared/styles/globals.css"; // Подключаем стили

export default function UsersAction() {
  const [isOpen, setIsOpen] = useState(false); // Для выпадающего меню

  // Функция для выполнения действия
  const handleActionClick = (type: string) => {
    console.log(`Действие выполнено: ${type}`);
    setIsOpen(false); // Закрываем выпадающее меню
  };

  return (
    <div>
      {/* Выпадающее меню */}
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu aria-label="Dropdown menu with actions" variant="faded">
          {/* Одобрить */}
          <DropdownItem
            key="approve"
            onClick={() => handleActionClick("Одобрить")}
          >
            Одобрить
          </DropdownItem>

          {/* Отклонить */}
          <DropdownItem
            key="reject"
            className="text-warning"

            onClick={() => handleActionClick("Отклонить")}
          >
            Отклонить
          </DropdownItem>

          {/* Заблокировать */}
          <DropdownItem
            key="block"
            className="text-danger"

            onClick={() => handleActionClick("Заблокировать")}
          >
            Заблокировать
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
