import { AuthLayout } from "@/widgets/layouts/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/password_recovery";
import "@/shared/styles/globals.css";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout name="Восстановление пароля">
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage; // Экспорт по умолчанию
