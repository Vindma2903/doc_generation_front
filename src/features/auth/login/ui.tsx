import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Link } from "@nextui-org/react";
import { Input } from "@/shared/ui/common/input";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";


interface LoginFormValues {
  email: string;
  password: string;
}

interface AuthUser {
  user_id: number;
  token: string;
}

export const LoginForm = () => {
  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = useAuth();
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

      const { token } = response.data;

      // Сохраняем токен
      localStorage.setItem("access_token", token);

      // Устанавливаем заголовок для будущих запросов
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Получаем текущего пользователя через /me
      const meRes = await axios.get("http://localhost:8080/me");
      setUser(meRes.data);

      navigate("/home");
      setError(null);
    } catch (err: any) {
      console.error(
        "Ошибка при авторизации:",
        err.response?.data?.error || err.message
      );
      setError(
        err.response?.data?.error || "Ошибка авторизации. Проверьте введённые данные."
      );
    }
  };

  return (
    <Form
      className="login-form w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <p className="text-red-500 text-center">{error}</p>}

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            validationBehavior="aria"
            isInvalid={fieldState.invalid}
            label="Email"
            labelPlacement="outside"
            placeholder="Введите e-mail"
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

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <InputPassword
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            validationBehavior="aria"
            isInvalid={fieldState.invalid}
            labelPlacement="outside"
            placeholder="Введите пароль"
            className="login-password w-full"
          />
        )}
        rules={{
          required: "Это обязательное поле",
          minLength: { value: 6, message: "Минимум 6 символов" },
        }}
      />

      <Button
        className="login-submit w-full text-md font-medium"
        variant="solid"
        color="primary"
        type="submit"
      >
        Войти
      </Button>

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
