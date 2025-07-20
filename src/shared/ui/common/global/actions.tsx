import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface ActionsDropdownProps {
  onRename: () => void;
  onDelete: () => void;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
                                                                  onRename,
                                                                  onDelete,
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

      <DropdownMenu aria-label="Действия над ролью">
        <DropdownItem
          key="rename"
          textValue="Переименовать"
          className="custom-dropdown-action"
          onClick={onRename}
        >
          <div className="flex items-center gap-2">
            <img src="/pen.svg" alt="Переименовать" className="w-4 h-4" />
            <span>Переименовать</span>
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
