import React, { useState } from "react";

type Role = "Сотрудник" | "Администратор" | "Владелец";
type Permissions = Record<Role, Record<string, boolean>>;

type Category = {
  name: string;
  actions: string[];
};

const categories: Category[] = [
  {
    name: "Шаблоны",
    actions: [
      "Создание шаблонов",
      "Редактирование шаблонов",
      "Удаление шаблонов",
    ],
  },
  {
    name: "Документы",
    actions: [
      "Чтение",
      "Добавление",
      "Изменение",
      "Удаление",
      "Импорт",
      "Экспорт",
    ],
  },
];

interface Props {
  roles: Role[];
  permissions: Permissions;
}

export const UserRoleMatrix: React.FC<Props> = ({ roles, permissions }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleCategory = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="user-role-matrix">
      <div className="matrix-grid" style={{ gridTemplateColumns: `2fr repeat(${roles.length}, 1fr)` }}>
        <div className="matrix-header empty-cell">Действие</div>
        {roles.map((role) => (
          <div key={role} className="matrix-header">
            {role}
          </div>
        ))}

        {categories.map((category) => {
          const isOpen = expanded[category.name];

          return (
            <React.Fragment key={category.name}>
              {category.actions.map((action, idx) => (
                isOpen && (
                  <React.Fragment key={action}>
                    <div className="matrix-action">
                      {idx === 0 && (
                        <span
                          className="matrix-category-toggle"
                          onClick={() => toggleCategory(category.name)}
                        >
                  <span className="caret-icon">{isOpen ? "▼" : "▶"}</span>
                          {category.name}:{" "}
                </span>
                      )}
                      {!idx && isOpen ? null : action}
                    </div>
                    {roles.map((role) => (
                      <div key={`${role}-${action}`} className="matrix-cell">
                        <input
                          type="checkbox"
                          checked={permissions[role]?.[action] || false}
                          readOnly
                        />
                      </div>
                    ))}
                  </React.Fragment>
                )
              ))}

              {/* Заголовок категории, если свернуто */}
              {!isOpen && (
                <React.Fragment>
                  <div
                    className="matrix-action"
                    onClick={() => toggleCategory(category.name)}
                    style={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    <span className="caret-icon">{isOpen ? "▼" : "▶"}</span>
                    {category.name}
                  </div>
                  {roles.map((role) => (
                    <div key={`${category.name}-${role}`} className="matrix-cell category-cell" />
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}

      </div>
    </div>
  );
};
