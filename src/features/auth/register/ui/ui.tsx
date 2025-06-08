import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Form, Link } from "@nextui-org/react";
import { Input } from "@/shared/ui/common/input";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const RegisterForm = () => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Инициализация useNavigate

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post(
        "http://localhost:8000/auth/registration",
        {
          username: data.name,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Пользователь успешно зарегистрирован");
      setError(null);

      // Перенаправляем пользователя на страницу подтверждения
      navigate("/confirm-register");
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error.response?.data?.detail || error.message);

      const errors = error.response?.data?.detail;
      if (Array.isArray(errors)) {
        setError(errors.map((err: any) => err.msg || JSON.stringify(err)).join(", "));
      } else {
        setError("Ошибка при регистрации.");
      }
    }
  };

  const password = watch("password");

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Сообщения об ошибке */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <Form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Поле для ввода имени */}
        <Controller
          control={control}
          name="name"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { invalid, error },
          }) => (
            <Input
              isRequired
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              label="Имя пользователя"
              labelPlacement="outside"
              placeholder="Введите имя пользователя"
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{
            required: "Это обязательное поле",
            minLength: { value: 2, message: "Минимум 2 символа" },
            maxLength: { value: 20, message: "Максимум 20 символов" },
          }}
        />

        {/* Поле для ввода email */}
        <Controller
          control={control}
          name="email"
          render={({
            field: { value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Input
              ref={ref}
              isRequired
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              label="Email"
              labelPlacement="outside"
              placeholder="example@mail.com"
              name="email"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{
            required: "Это обязательное поле",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Введите корректный адрес электронной почты",
            },
          }}
        />

        {/* Поле для ввода пароля */}
        <Controller
          control={control}
          name="password"
          render={({
            field: { value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <InputPassword
              ref={ref}
              isRequired
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              type="password"
              label="Пароль"
              labelPlacement="outside"
              placeholder="Введите пароль"
              name="password"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{
            required: "Это обязательное поле",
            minLength: { value: 6, message: "Минимум 6 символов" },
          }}
        />

        {/* Подтверждение пароля */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <InputPassword
              ref={ref}
              isRequired
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              type="password"
              label="Подтверждение пароля"
              labelPlacement="outside"
              placeholder="Подтвердите пароль"
              name="confirmPassword"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          rules={{
            required: "Это обязательное поле",
            validate: (value) => value === password || "Пароли не совпадают",
          }}
        />

        {/* Чекбокс согласия */}
        <div className="mt-4 flex flex-col gap-3 checkbox-container">
          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { value, onChange }, fieldState: { invalid } }) => (
              <Checkbox
                isRequired
                isInvalid={invalid}
                isSelected={value}
                onChange={onChange}
                aria-label="Согласие с условиями"
              >
                Отправляя сведения через электронную почту вы соглашаетесь с условиями{" "}
                <Link className="font-medium leading-none" href="/offer">
                  оферты
                </Link>{" "}
                и даете согласие на обработку персональных данных на условиях{" "}
                <Link className="font-medium leading-none" href="/privacy_policy">
                  Политики
                </Link>
              </Checkbox>
            )}
            rules={{
              required: "Вы должны согласиться с условиями.",
            }}
          />
        </div>

        {/* Кнопка отправки */}
        <Button
          className="w-full text-md font-medium"
          variant="solid"
          color="primary"
          type="submit"
        >
          Начать бесплатный период
        </Button>

        {/* Ссылки на вход */}
        <span className="w-full flex flex-row gap-1 justify-center">
          <p>Уже есть аккаунт?</p>{" "}
          <Link className="font-medium" href="/login">
            Войти
          </Link>
        </span>
      </Form>
    </div>
  );
};
