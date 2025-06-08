import React from "react";
import { BrowserRouter } from "react-router-dom"; // Импортируем BrowserRouter
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/features/auth/AuthContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter> {/* Оборачиваем всё приложение в Router */}
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </BrowserRouter>
  );
};
