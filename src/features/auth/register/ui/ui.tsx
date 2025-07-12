import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/react";
import { Button } from "@/shared/ui/common/global/btn";
import { Input } from "@/shared/ui/common/global/input";
import { InputPassword } from "@/shared/ui/common/input-password";
import { useNavigate } from "react-router-dom";
import "@/shared/styles/globals.css";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  const { handleSubmit, control } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await axios.post(
        "http://localhost:8080/register",
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setError(null);
      console.log("Пользователь успешно зарегистрирован");
      navigate("/confirm-register");
    } catch (err: any) {
      console.error("Ошибка при регистрации:", err.response?.data?.detail || err.message);
      const errors = err.response?.data?.detail;
      if (Array.isArray(errors)) {
        setError(errors.map((e: any) => e.msg || JSON.stringify(e)).join(", "));
      } else {
        setError("Ошибка при регистрации.");
      }
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="auth-form__error">{error}</p>}

      <div className="auth-form__field">
        <label htmlFor="firstName" className="auth-form__label">Имя</label>
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="firstName"
              type="text"
              placeholder="Введите имя"
              isRequired
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              className="auth-form__input"
            />
          )}
          rules={{
            required: "Это обязательное поле",
            minLength: { value: 2, message: "Минимум 2 символа" },
          }}
        />
      </div>

      <div className="auth-form__field">
        <label htmlFor="lastName" className="auth-form__label">Фамилия</label>
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="lastName"
              type="text"
              placeholder="Введите фамилию"
              isRequired
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              className="auth-form__input"
            />
          )}
          rules={{
            required: "Это обязательное поле",
            minLength: { value: 2, message: "Минимум 2 символа" },
          }}
        />
      </div>

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
              value: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
              message: "Введите корректный адрес электронной почты",
            },
          }}
        />
      </div>

      <div className="auth-form__field">
        <label htmlFor="password" className="auth-form__label">Пароль</label>
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

      <Button className="auth-form__submit" type="submit">
        Зарегистрироваться
      </Button>

      <div className="auth-form__footer">
        <p>
          Уже есть аккаунт?{" "}
          <a className="auth-form__link" href="/login">
            Войти
          </a>
        </p>
      </div>
    </Form>
  );
};
