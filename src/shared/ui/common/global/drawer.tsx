import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
} from "@heroui/react";
import axios from "axios";

type UserDrawerProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

export const MailIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
      fill="currentColor"
    />
  </svg>
);

const UserDrawer: React.FC<UserDrawerProps> = ({ isOpen, onOpenChange, onClose }) => {
  const [formFields, setFormFields] = useState([
    {
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
      role: "Сотрудник",
    },
  ]);

  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [loading, setLoading] = useState(false);

  // 🔄 Получить роли при открытии
  useEffect(() => {
    if (!isOpen) return;

    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const res = await axios.get("http://localhost:8080/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roles: { id: number; name: string }[] = res.data;
        setAvailableRoles(roles.map((r) => r.name));
      } catch (err) {
        console.error("Ошибка при получении ролей:", err);
      }
    };

    fetchRoles();
  }, [isOpen]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...formFields];
    updated[index][field as keyof typeof updated[0]] = value;
    setFormFields(updated);

    setErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: "" },
    }));
  };

  const handleAddMore = () => {
    setFormFields([
      ...formFields,
      {
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
        role: availableRoles[0] || "Сотрудник",
      },
    ]);
  };

  const validateFields = () => {
    const newErrors: typeof errors = {};
    formFields.forEach((user, index) => {
      const fieldErrors: { [key: string]: string } = {};
      if (!user.email.trim()) fieldErrors.email = "Обязательное поле";
      if (!user.firstName.trim()) fieldErrors.firstName = "Обязательное поле";
      if (!user.lastName.trim()) fieldErrors.lastName = "Обязательное поле";
      if (Object.keys(fieldErrors).length > 0) newErrors[index] = fieldErrors;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || "";

      await Promise.all(
        formFields.map((user) =>
          axios.post(
            "http://localhost:8080/invite",
            {
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              role: user.role,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      alert("Приглашения отправлены!");
      setFormFields([
        { email: "", firstName: "", lastName: "", middleName: "", role: "Сотрудник" },
      ]);
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error("Ошибка при отправке:", err);
      alert(
        err.response?.data?.error ||
        "Ошибка при отправке приглашений. Попробуйте позже."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <DrawerContent className="max-w-6xl w-full mx-auto">
        <DrawerHeader className="text-lg font-semibold">Добавление пользователей</DrawerHeader>

        <DrawerBody className="space-y-6">
          {formFields.map((user, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                label="E-mail"
                labelPlacement="outside"
                placeholder="example@mail.com"
                value={user.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
                variant="bordered"
                className="rounded-none"
                endContent={<MailIcon className="text-xl text-default-400" />}
                classNames={{ input: "!p-0" }}
                isInvalid={!!errors[index]?.email}
                errorMessage={errors[index]?.email}
              />
              <Input
                label="Фамилия"
                labelPlacement="outside"
                placeholder="Введите фамилию"
                value={user.lastName}
                onChange={(e) => handleChange(index, "lastName", e.target.value)}
                variant="bordered"
                className="rounded-none"
                classNames={{ input: "!p-0" }}
                isInvalid={!!errors[index]?.lastName}
                errorMessage={errors[index]?.lastName}
              />
              <Input
                label="Имя"
                labelPlacement="outside"
                placeholder="Введите имя"
                value={user.firstName}
                onChange={(e) => handleChange(index, "firstName", e.target.value)}
                variant="bordered"
                className="rounded-none"
                classNames={{ input: "!p-0" }}
                isInvalid={!!errors[index]?.firstName}
                errorMessage={errors[index]?.firstName}
              />
              <Input
                label="Отчество"
                labelPlacement="outside"
                placeholder="Введите отчество"
                value={user.middleName}
                onChange={(e) => handleChange(index, "middleName", e.target.value)}
                variant="bordered"
                className="rounded-none"
                classNames={{ input: "!p-0" }}
              />
              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor={`role-${index}`} className="text-gray-700">Роль</label>
                <select
                  id={`role-${index}`}
                  value={user.role}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                  className="border rounded px-3 py-2 text-sm bg-white"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <Button
            onPress={handleAddMore}
            variant="ghost"
            size="sm"
            className="text-sm px-5 py-3 font-medium w-[160px] flex items-center gap-2"
          >
            <img src="/public/plus.svg" alt="+" className="w-4 h-4" />
            Добавить ещё
          </Button>
        </DrawerBody>

        <DrawerFooter className="flex justify-end gap-4">
          <Button onPress={onClose} className="cancel-btn w-full sm:w-[160px]" variant="flat">
            Отменить
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
            className="w-full sm:w-[160px]"
          >
            Добавить
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
