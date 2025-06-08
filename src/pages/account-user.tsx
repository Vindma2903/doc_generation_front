import React, { useState } from "react";
import "@/shared/styles/globals.css";
import "@/shared/styles/account-user.css"; // Подключаем CSS файл
import { MainSidebar } from "@/shared/ui/common/main-sidebar"; // Основное меню
import { UserAccSidebar } from "@/shared/ui/common/user-acc-sidebar"; // Новое меню
import Breadcrumbs from "@/shared/ui/common/Breadcrumb"; // Хлебные крошки
import { Controller, useForm } from "react-hook-form"; // Управление формой
import { Input } from "@/shared/ui/common/input"; // Компонент для ввода

interface ProfileFormValues {
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const AccountUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile"); // Управление активной вкладкой

  const breadcrumbs =
    activeTab === "profile"
      ? [
          { label: "Профиль", to: "/" },
          { label: "Настройки профиля", to: "/account-user" },
        ]
      : [

          { label: "Профиль", to: "/account-user" },
          { label: "Безопасность", to: "/account-user/security" },
        ];

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      lastName: "",
      firstName: "",
      phone: "",
      email: "example@mail.com", // Пример электронной почты
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Данные профиля:", data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-content-container">
            {/* Фото пользователя */}
            <div className="profile-photo-container">
              <img
                src="/big-photo.png"
                alt="Фото пользователя"
                className="profile-photo"
              />
            </div>

            {/* Форма редактирования */}
            <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <div className="form-group form-group-half">
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Фамилия"
                        labelPlacement="outside"
                        placeholder="Введите фамилию"
                        isRequired
                      />
                    )}
                    rules={{
                      required: "Это обязательное поле",
                      minLength: { value: 2, message: "Минимум 2 символа" },
                    }}
                  />
                </div>
                <div className="form-group form-group-half">
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Имя"
                        labelPlacement="outside"
                        placeholder="Введите имя"
                        isRequired
                      />
                    )}
                    rules={{
                      required: "Это обязательное поле",
                      minLength: { value: 2, message: "Минимум 2 символа" },
                    }}
                  />
                </div>
              </div>
              <div className="form-group form-group-wide">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Номер телефона"
                      labelPlacement="outside"
                      placeholder="Введите номер телефона"
                    />
                  )}
                />
              </div>
              <div className="form-group form-group-wide locked-input-group">
                <label htmlFor="email" className="input-label">
                  Электронная почта
                </label>
                <div className="locked-input-wrapper">
                  <input
                    type="text"
                    id="email"
                    value="example@mail.com"
                    disabled
                    className="locked-input"
                  />
                  <img
                    src="/lock.svg"
                    alt="Заблокировано"
                    className="locked-icon"
                  />
                </div>
              </div>
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </form>
          </div>
        );
      case "security":
        return (
          <div className="security-content-container">
            <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
              {/* Поле для старого пароля */}
              <div className="form-group form-group-wide">
                <Controller
                  control={control}
                  name="oldPassword"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Старый пароль"
                      labelPlacement="outside"
                      placeholder="Введите старый пароль"
                    />
                  )}
                />
              </div>

              {/* Поле для нового пароля */}
              <div className="form-group form-group-wide">
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Новый пароль"
                      labelPlacement="outside"
                      placeholder="Введите новый пароль"
                    />
                  )}
                />
              </div>

              {/* Поле для подтверждения пароля */}
              <div className="form-group form-group-wide">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Подтверждение пароля"
                      labelPlacement="outside"
                      placeholder="Подтвердите пароль"
                    />
                  )}
                />
              </div>

              {/* Кнопка сохранения */}
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <MainSidebar />
      <main className="content">
        <div className="content-wrapper">
          <UserAccSidebar onTabChange={setActiveTab} />
          <div className="profile-content">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h2 className="content-title">
              {activeTab === "profile" ? "Профиль пользователя" : "Безопасность"}
            </h2>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountUser;
