import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form } from "@heroui/react";
import { Button } from "@/shared/ui/common/global/btn";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useAuth } from "@/features/auth/AuthContext";
import "@/shared/styles/globals.css";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function SetPasswordPage() {
  const { handleSubmit, control, watch } = useForm<ResetPasswordForm>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const passwordValue = watch("password");
  const { setUser } = useAuth();

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError("Токен не найден в ссылке");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/set-password",
        {
          token,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token: accessToken } = res.data;
      localStorage.setItem("access_token", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Загружаем текущего пользователя (если используется useAuth)
      const meRes = await axios.get("http://localhost:8080/me");
      setUser(meRes.data);

      setSuccess(true);
      setError(null);

      setTimeout(() => navigate("/home"), 1000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "Ошибка при установке пароля. Попробуйте позже."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-2xl font-semibold mb-6">Новый пароль</h1>

        <Form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {error && <p className="auth-form__error">{error}</p>}
          {success && <p className="auth-form__success">Пароль успешно сохранён!</p>}

          {/* Пароль */}
          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Пароль
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Введите новый пароль",
                minLength: { value: 6, message: "Минимум 6 символов" },
              }}
              render={({ field, fieldState }) => (
                <InputPassword
                  {...field}
                  id="password"
                  placeholder="Введите новый пароль"
                  isRequired
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  className="auth-form__input"
                />
              )}
            />
          </div>

          {/* Подтверждение пароля */}
          <div className="auth-form__field">
            <label htmlFor="confirmPassword" className="auth-form__label">
              Подтверждение пароля
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Подтвердите пароль",
                validate: (value) =>
                  value === passwordValue || "Пароли не совпадают",
              }}
              render={({ field, fieldState }) => (
                <InputPassword
                  {...field}
                  id="confirmPassword"
                  placeholder="Повторите пароль"
                  isRequired
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  className="auth-form__input"
                />
              )}
            />
          </div>

          <Button className="auth-form__submit mt-4" type="submit">
            Сохранить
          </Button>
        </Form>
      </div>
    </div>
  );
}
