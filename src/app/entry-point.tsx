import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, Navigate } from "react-router-dom";



import "@/shared/styles/globals.css";





import { LoginPage, RegistrationPage, HomePage, ProjectsPage } from "@/pages";
import ForgotPasswordPage from "@/pages/forgot-password-page";


import AdminUsers from "@/pages/admin-users";

import AccountUser from "@/pages/account-user";
import ConfirmRegister from "@/features/auth/register/ui/confirm-register";
import { Providers } from "./providers";
import DocumentTemplatePage from "@/pages/document-template";
import CreateTemplatePage from "@/pages/create-templates";
import EditTemplatePage from "@/pages/EditTemplatePage"; // добавь в импорты
import { TagPage } from "@/pages/tag-page"
import { DocumentsPage } from "@/pages/documents"; // путь подкорректируй под свою структуру
import FillTemplatePage from "@/pages/FillTemplatePage"
import AddUserPage from "@/pages/user-page.tsx"; // Добавление пользователей
import CounterpartiesPage from "@/pages/counterparties";
import { VerifyPage } from "@/pages/VerifyPage.tsx" // Контрагенты
import SetPasswordPage from "@/pages/set-password"; // Установка пароля







createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers> {/* Провайдеры оборачивают всё приложение */}
      <Routes>
        <Route element={<Navigate to="/home" />} path="/" />
        <Route element={<HomePage />} path="/home" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegistrationPage />} path="/register" />
        <Route element={<ForgotPasswordPage />} path="/forgot-password" />
        <Route element={<ProjectsPage />} path="/projects" />
        <Route element={<AdminUsers />} path="/admin-users" />
        <Route element={<AccountUser />} path="/account-user" />
        <Route element={<ConfirmRegister />} path="/confirm-register" />
        <Route element={<>Offer</>} path="/offer" />
        <Route element={<>Privacy Policy</>} path="/privacy_policy" />
        <Route element={<DocumentTemplatePage />} path="/document-template" />
        <Route path="/create-template" element={<CreateTemplatePage />} />
        <Route path="/edit-template/:id" element={<EditTemplatePage />} />
        <Route path="/tags" element={<TagPage />} />
        <Route element={<DocumentsPage />} path="/documents" />
        <Route path="/documents/fill/:id" element={<FillTemplatePage />} />
        <Route path="/user-page" element={<AddUserPage />} />
        <Route path="/counterparties" element={<CounterpartiesPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />








      </Routes>
    </Providers>
  </StrictMode>
);
