import { Controller, useForm } from "react-hook-form";
import { Button, Form, Link } from "@nextui-org/react";
import { Input } from "@/shared/ui/common/input";

interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordForm = () => {
  const { handleSubmit, control } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Forgot Password Data:", data);
  };

  return (
    <Form
      className="forgot-password-form w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
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
            placeholder="Введите электронную почту"
            name="email"
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            className="forgot-password-email w-full"
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

      {/* Кнопка восстановления */}
      <Button
        className="forgot-password-submit w-full text-md font-medium"
        variant="solid"
        color="primary"
        type="submit"
      >
        Восстановить
      </Button>

      {/* Ссылка на вход */}
      <div className="forgot-password-footer flex flex-col gap-2 items-center justify-center h-full text-center">
        <span className="flex flex-row gap-1 justify-center items-center">
          <p>Вспомнили пароль?</p>
          <Link className="back-to-login-link font-medium" href="/login">
            Войти
          </Link>
        </span>
      </div>
    </Form>
  );
};
