import { AuthLayout } from "@/widgets/layouts/auth-layout";
import { LoginForm } from "@/features/auth/login"; // Исправлено: подключение LoginForm
import "@/shared/styles/globals.css"; // Подключение глобального CSS

export const LoginPage = () => {
  return (
    <AuthLayout name="Авторизация">
      <LoginForm />
    </AuthLayout>
  );
};
