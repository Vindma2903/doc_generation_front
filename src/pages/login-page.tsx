import { AuthLayout } from "@/widgets/layouts/auth-layout";
import { LoginForm } from "@/features/auth/login"; // Исправлено: подключение LoginForm


export const LoginPage = () => {
  return (
    <AuthLayout name="Авторизация">
      <LoginForm />
    </AuthLayout>
  );
};
