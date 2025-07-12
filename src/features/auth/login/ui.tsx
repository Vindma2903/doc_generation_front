import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/react";
import { Button } from "@/shared/ui/common/global/btn";
import { Input } from "@/shared/ui/common/global/input";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import "@/shared/styles/globals.css";

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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

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
      localStorage.setItem("access_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const meRes = await axios.get("http://localhost:8080/me");
      setUser(meRes.data);

      setError(null);
      navigate("/home");
    } catch (err: any) {
      console.error("Ошибка при авторизации:", err.response?.data?.error || err.message);
      setError(
        err.response?.data?.error || "Ошибка авторизации. Проверьте введённые данные."
      );
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="auth-form__error">{error}</p>}

      {/* Email */}
      <div className="auth-form__field">
        <label htmlFor="email" className="auth-form__label">Email</label>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="email"
              type="text"
              placeholder="Введите e-mail"
              isRequired
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              className="auth-form__input"
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
      </div>

      {/* Пароль */}
      <div className="auth-form__field">
        <div className="auth-form__label-row">
          <label htmlFor="password" className="auth-form__label">Пароль</label>
          <a href="/forgot-password" className="auth-form__link auth-form__forgot-link">
            Забыли пароль?
          </a>
        </div>
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <InputPassword
              {...field}
              id="password"
              type="password"
              placeholder="Введите пароль"
              isRequired
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              className="auth-form__input"
            />
          )}
          rules={{
            required: "Это обязательное поле",
            minLength: { value: 6, message: "Минимум 6 символов" },
          }}
        />
      </div>

      {/* Кнопка входа */}
      <Button className="auth-form__submit" type="submit">
        Войти
      </Button>

      {/* Ссылка на регистрацию */}
      <div className="auth-form__footer">
        <p>
          Нет аккаунта?{" "}
          <Link className="auth-form__link" to="/register">
            Создать аккаунт
          </Link>
        </p>
      </div>
    </Form>
  );
};
