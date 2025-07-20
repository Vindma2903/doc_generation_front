import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface ActionsDropdownProps {
  onBlock: () => void;
  onDelete: () => void;
  onChangeRole: () => void;
  isBlocked: boolean; // 🔹 добавлен флаг блокировки
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
                                                                  onBlock,
                                                                  onDelete,
                                                                  onChangeRole,
                                                                  isBlocked,
                                                                }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <img
          src="/actions.svg"
          alt="Действия"
          className="w-4 h-4 cursor-pointer"
        />
      </DropdownTrigger>

      <DropdownMenu aria-label="Действия над пользователем">
        <DropdownItem
          key="block"
          textValue={isBlocked ? "Разблокировать" : "Заблокировать"}
          className="custom-dropdown-action"
          onClick={onBlock}
        >
          <div className="flex items-center gap-2">
            <img
              src={isBlocked ? "/public/lock-keyhole-open.svg" : "/ban.svg"} // 🔹 иконка зависит от статуса
              alt={isBlocked ? "Разблокировать" : "Заблокировать"}
              className="w-4 h-4"
            />
            <span>{isBlocked ? "Разблокировать" : "Заблокировать"}</span>
          </div>
        </DropdownItem>

        <DropdownItem
          key="change-role"
          textValue="Сменить роль"
          className="custom-dropdown-action"
          onClick={onChangeRole}
        >
          <div className="flex items-center gap-2">
            <img src="/users.svg" alt="Сменить роль" className="w-4 h-4" />
            <span>Сменить роль</span>
          </div>
        </DropdownItem>

        <DropdownItem
          key="delete"
          textValue="Удалить"
          className="custom-dropdown-action"
          onClick={onDelete}
        >
          <div className="flex items-center gap-2">
            <img src="/trash.svg" alt="Удалить" className="w-4 h-4" />
            <span>Удалить</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
