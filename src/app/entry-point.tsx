import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, Navigate } from "react-router-dom";



import "@/shared/styles/globals.css";

import { LoginPage, RegistrationPage, HomePage, ProjectsPage } from "@/pages";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ProjectEdits from "@/pages/project-edits";
import KnowledgeBase from "@/pages/knowledge-base";
import AdminUsers from "@/pages/admin-users";
import CRMPage from "@/pages/crm";
import DialogUser from "@/pages/dialog-user";
import AccountUser from "@/pages/account-user";
import ConfirmRegister from "@/features/auth/register/ui/confirm-register";
import { Providers } from "./providers";
import IntegrationPage from "@/pages/integration-page";
import DocumentTemplatePage from "@/pages/document-template";
import CreateTemplatePage from "@/pages/create-templates";
import EditTemplatePage from "@/pages/EditTemplatePage"; // добавь в импорты
import { TagPage } from "@/pages/tag-page"
import { DocumentsPage } from "@/pages/documents"; // путь подкорректируй под свою структуру
import FillTemplatePage from "@/pages/FillTemplatePage"




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
        <Route element={<KnowledgeBase />} path="/knowledge-base" />
        <Route element={<ProjectEdits />} path="/project-edits" />
        <Route element={<AdminUsers />} path="/admin-users" />
        <Route element={<CRMPage />} path="/crm" />
        <Route element={<DialogUser />} path="/dialog-user" />
        <Route element={<AccountUser />} path="/account-user" />
        <Route element={<ConfirmRegister />} path="/confirm-register" />
        <Route element={<>Offer</>} path="/offer" />
        <Route element={<>Privacy Policy</>} path="/privacy_policy" />
        <Route element={<IntegrationPage />} path="/integration" />
        <Route element={<DocumentTemplatePage />} path="/document-template" />
        <Route path="/create-template" element={<CreateTemplatePage />} />
        <Route path="/edit-template/:id" element={<EditTemplatePage />} />
        <Route path="/tags" element={<TagPage />} />
        <Route element={<DocumentsPage />} path="/documents" />
        <Route path="/documents/fill/:id" element={<FillTemplatePage />} />





      </Routes>
    </Providers>
  </StrictMode>
);
