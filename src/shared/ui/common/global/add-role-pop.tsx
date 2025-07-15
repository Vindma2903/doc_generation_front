import React, { useEffect, useState } from "react";
import "@/shared/styles/globals.css";
import { useAuth } from "@/features/auth/AuthContext";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Button } from "@/shared/ui/common/global/btn";
import axios from "axios";

interface AddRolePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleName: string, selectedUserIds: number[]) => void;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

export const AddRolePopup: React.FC<AddRolePopupProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            onSave,
                                                          }) => {
  const [roleName, setRoleName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { user } = useAuth(); // подключено, если потребуется

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("access_token");
      axios
        .get("http://localhost:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const raw = Array.isArray(res.data) ? res.data : res.data.users;
          if (Array.isArray(raw)) {
            const formatted = raw.map((user) => {
              const [firstName = "", lastName = ""] = user.name?.split(" ") || [];
              return {
                id: user.id,
                firstName,
                lastName,
                role: user.position,
              };
            });
            setEmployees(formatted);
          } else {
            console.error("Неправильный формат данных:", res.data);
            setEmployees([]);
          }
        })
        .catch((err) => {
          console.error("Ошибка при загрузке сотрудников", err);
        });
    }
  }, [isOpen]);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!roleName.trim() || selectedUsers.length === 0) return;

    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        "http://localhost:8080/users/assign-role",
        {
          user_ids: selectedUsers,
          role: roleName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Роли успешно обновлены");
      onSave(roleName.trim(), selectedUsers); // если нужен callback
      setRoleName("");
      setSelectedUsers([]);
      onClose();
    } catch (err) {
      console.error("Ошибка при назначении роли:", err);
      alert("Не удалось назначить роль. Проверьте права доступа.");
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      backdrop="opaque"
      onOpenChange={onClose}
      placement="center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="text-lg font-semibold">
            Добавить новую роль
          </ModalHeader>

          <ModalBody>
            <label htmlFor="roleName" className="block text-sm font-medium mb-1">
              Название роли
            </label>
            <input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Введите название"
              className="w-full border rounded px-3 py-2 mb-4 text-sm"
            />

            <p className="text-sm font-medium mb-2">Сотрудники</p>
            <div className="max-h-[260px] overflow-y-auto border rounded p-2 space-y-2">
              {employees.map(({ id, firstName, lastName, role }) => {
                const isSelected = selectedUsers.includes(id);
                const fullName = `${firstName} ${lastName}`;

                return (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleUser(id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleUser(id);
                    }}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition ${
                      isSelected
                        ? "bg-blue-100 border border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center justify-center text-xs uppercase">
                        {(firstName?.[0] || "").toUpperCase()}
                        {(lastName?.[0] || "").toUpperCase()}
                      </div>

                      <div className="flex flex-col text-sm">
                        <span className="font-medium truncate">{fullName}</span>
                        <span className="text-gray-500 text-xs truncate">{role}</span>
                      </div>
                    </div>

                    <img
                      src="/circle-plus.svg"
                      alt="Назначить"
                      className={`w-5 h-5 opacity-70 ${
                        isSelected ? "opacity-100" : "hover:opacity-100"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button className="cancel-btn small w-[120px]" onClick={onClose}>
              Отмена
            </Button>
            <Button className="bg-primary small w-[120px]" onClick={handleSave}>
              Назначить роль
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
