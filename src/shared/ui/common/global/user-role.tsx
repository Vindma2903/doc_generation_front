import React, { useEffect, useRef, useState } from "react";
import { ActionsDropdown } from "@/shared/ui/common/global/actions";
import "@/shared/styles/globals.css";

type Role = string;
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
  onRenameRole?: (oldName: string, newName: string) => void;
  onDeleteRole?: (role: string) => void; // 💡 это обязательно нужно
}

export const UserRoleMatrix: React.FC<Props> = ({
                                                  roles,
                                                  permissions,
                                                  onRenameRole,
                                                  onDeleteRole, // 🛠️ вот что не хватало!
                                                }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRole && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingRole]);

  const toggleCategory = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const startEditing = (role: string) => {
    setEditingRole(role);
    setNewRoleName(role);
  };

  const finishEditing = (oldName: string) => {
    const trimmed = newRoleName.trim();
    if (trimmed && trimmed !== oldName) {
      onRenameRole?.(oldName, trimmed);
    }
    setEditingRole(null);
    setNewRoleName("");
  };

  const deleteRole = (role: string) => {
    console.log("[UserRoleMatrix] deleteRole:", role);
    onDeleteRole?.(role); // ✅ передаём вверх
  };

  return (
    <div className="user-role-matrix w-full">
      <div
        className="matrix-grid w-full"
        style={{
          display: "grid",
          gridTemplateColumns: `2fr repeat(${roles.length}, 1fr)`,
          width: "100%", // ✅ тянется по ширине родителя
        }}
      >

      <div className="matrix-header empty-cell">Действие</div>

        {roles.map((role) => (
          <div
            key={role}
            className="matrix-header flex items-center justify-center gap-2"
          >
            {editingRole === role ? (
              <input
                ref={inputRef}
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onBlur={() => finishEditing(role)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishEditing(role);
                }}
                className="border rounded px-2 py-1 text-sm w-full"
              />
            ) : (
              <>
                <span className="truncate">{role}</span>
                <ActionsDropdown
                  onRename={() => startEditing(role)}
                  onDelete={() => deleteRole(role)} // ✅ теперь работает
                />
              </>
            )}
          </div>
        ))}

        {categories.map((category) => {
          const isOpen = expanded[category.name];

          return (
            <React.Fragment key={category.name}>
              {category.actions.map((action, idx) =>
                isOpen ? (
                  <React.Fragment key={action}>
                    <div className="matrix-action">
                      {idx === 0 ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleCategory(category.name)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              toggleCategory(category.name);
                            }
                          }}
                          className="matrix-category-toggle"
                          style={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          <span className="caret-icon">
                            {isOpen ? "▼" : "▶"}
                          </span>{" "}
                          {category.name}:
                        </span>
                      ) : (
                        action
                      )}
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
                ) : null
              )}

              {!isOpen && (
                <>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCategory(category.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleCategory(category.name);
                      }
                    }}
                    className="matrix-action"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    <span className="caret-icon">
                      {isOpen ? "▼" : "▶"}
                    </span>{" "}
                    {category.name}
                  </div>
                  {roles.map((role) => (
                    <div
                      key={`${category.name}-${role}`}
                      className="matrix-cell category-cell"
                    />
                  ))}
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
