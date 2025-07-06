import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
} from "@heroui/react";

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
    { email: "", firstName: "", lastName: "", middleName: "" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...formFields];
    updated[index][field as keyof typeof updated[0]] = value;
    setFormFields(updated);
  };

  const handleAddMore = () => {
    setFormFields([
      ...formFields,
      { email: "", firstName: "", lastName: "", middleName: "" },
    ]);
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <DrawerContent className="max-w-4xl w-full mx-auto">
      <DrawerHeader className="text-lg font-semibold">
          Добавление пользователей
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {formFields.map((user, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
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
          <Button
            onPress={onClose}
            className="cancel-btn w-full sm:w-[160px]"
            variant="flat"
          >
            Отменить
          </Button>

          <Button
            color="primary"
            onPress={onClose}
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
