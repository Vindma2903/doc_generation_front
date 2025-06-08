import { RegisterForm } from "@/features/auth/register"
import { AuthLayout } from "@/widgets/layouts/auth-layout"
import "@/shared/styles/globals.css"; // Подключение глобального CSS

export const RegistrationPage = () => {
  return <AuthLayout name="Регистрация" children={<RegisterForm />} />
}
