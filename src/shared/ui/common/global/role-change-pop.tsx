import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Button } from "@/shared/ui/common/global/btn";
import axios from "axios";

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface SelectedUser {
  id: number;
  fullName: string;
  email: string;
  role?: string;
}

interface RoleChangePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: SelectedUser | null;
}

export const RoleChangePopup: React.FC<RoleChangePopupProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  onSave,
                                                                  user,
                                                                }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setSelectedRole("");
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8080/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Ошибка загрузки ролей:", error);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedRole) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8080/users/assign-role",
        {
          user_ids: [user.id],
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave();
      onClose();
    } catch (error) {
      console.error("Ошибка при назначении роли:", error);
      alert("Не удалось сменить роль.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="opaque"
      placement="center"
      motionProps={{
        variants: {
          enter: { y: 0, opacity: 1, transition: { duration: 0.3 } },
          exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
        },
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="text-lg font-semibold">
            Сменить роль пользователю
          </ModalHeader>

          <ModalBody>
            {user && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">Пользователь:</p>
                <div className="mt-2 font-medium text-base">
                  {user.fullName}
                </div>

                {user.role && (
                  <p className="text-sm text-gray-500 mt-2">
                    Текущая роль:{" "}
                    <span className="font-semibold">{user.role}</span>
                  </p>
                )}
              </div>
            )}

            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Выберите новую роль
            </label>

            <div className="relative">
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm appearance-none bg-white"
              >
                <option value="">-- Выберите роль --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <img src="/chevron-down.svg" alt="▼" className="w-4 h-4" />
              </div>
            </div>

            {selectedRole && (
              <p className="text-xs text-gray-500 mt-2">
                {roles.find((r) => r.name === selectedRole)?.description ||
                  "Нет описания для этой роли"}
              </p>
            )}
          </ModalBody>


          <ModalFooter>
            <Button className="cancel-btn small w-[120px]" onClick={onClose}>
              Отмена
            </Button>
            <Button
              className="bg-primary small w-[120px]"
              onClick={handleSave}
              disabled={!selectedRole}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
