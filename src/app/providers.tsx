import React from "react";
import { BrowserRouter } from "react-router-dom"; // Импортируем BrowserRouter
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/features/auth/AuthContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter> {/* Оборачиваем всё приложение в Router */}
      <HeroUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </BrowserRouter>
  );
};
