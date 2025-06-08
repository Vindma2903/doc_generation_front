import React from "react";
import { Link } from "react-router-dom"; // Импортируем Link для навигации
import "@/shared/styles/globals.css"; // Глобальные стили

type Breadcrumb = {
  label: string;
  to: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[]; // Список хлебных крошек
  separator?: string; // Разделитель между крошками
  activeClassName?: string; // Класс для последнего элемента
  linkClassName?: string; // Класс для ссылок
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  separator = "/", // По умолчанию разделитель — "/"
  activeClassName = "breadcrumb-active", // По умолчанию класс для активного элемента
  linkClassName = "breadcrumb-link", // По умолчанию класс для ссылок
}) => {
  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          {index === breadcrumbs.length - 1 ? (
            // Последний элемент
            <span className={activeClassName}>{breadcrumb.label}</span>
          ) : (
            // Ссылка для всех, кроме последнего элемента
            <Link to={breadcrumb.to} className={linkClassName}>
              {breadcrumb.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <span className="breadcrumb-separator">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
