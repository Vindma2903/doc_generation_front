import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Link } from "@nextui-org/react";
import { Input } from "@/shared/ui/common/input";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext"; // Контекст авторизации

// Интерфейс формы логина
interface LoginFormValues {
  email: string;
  password: string;
}

// Интерфейс получаемых данных пользователя
interface AuthUser {
  user_id: number;  // Обновлено с "id" на "user_id"
  token: string;
}

export const LoginForm = () => {
  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = useAuth(); // Контекст авторизации
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post<AuthUser>(
        "http://localhost:8080/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Авторизация успешна:", response.data);
      setError(null);

      // ✅ Сохраняем токен, полученный как `token`
      localStorage.setItem("access_token", response.data.token);

      // Обновляем контекст (если тебе нужно, можешь получить user через /me потом)
      setUser({}); // временно можно просто пустой объект, если нужен redirect

      navigate("/home");
    } catch (err: any) {
      console.error(
        "Ошибка при авторизации:",
        err.response?.data?.detail || err.message
      );
      setError(
        err.response?.data?.detail ||
        "Ошибка авторизации. Проверьте введённые данные."
      );
    }
  };


  return (
    <Form
      className="login-form w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Ошибка авторизации */}
      {error && <p className="text-red-500 text-center">{error}</p>}

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
            placeholder="Введите e-mail"
            name="email"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            className="login-email w-full"
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
            labelPlacement="outside"
            placeholder="Введите пароль"
            name="password"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            className="login-password w-full"
          />
        )}
        rules={{
          required: "Это обязательное поле",
          minLength: { value: 6, message: "Минимум 6 символов" },
        }}
      />

      {/* Кнопка входа */}
      <Button
        className="login-submit w-full text-md font-medium"
        variant="solid"
        color="primary"
        type="submit"
      >
        Войти
      </Button>

      {/* Ссылки на регистрацию */}
          <div className="w-full flex justify-center mt-4">
      <span className="flex gap-1">
        <p>Нет аккаунта?</p>
        <Link className="font-medium #615ef0" href="/register">
          Создать аккаунт
        </Link>
      </span>
          </div>

    </Form>
  );
};
