import { Select, SelectItem } from "@nextui-org/react";

export const animals = [
  { key: "Ответы по тексту", label: "Ответы по тексту" },
  { key: "Универсальный агент", label: "Универсальный агент" },
];

export default function App() {
  return (
    <div className="select-container">
      {/* Заголовок над выпадающим списком */}
      <h3 className="select-label">Роль агента</h3>

      {/* Выпадающий список */}
      <Select
        className="custom-select"
        placeholder="Ответы по тексту"
        popoverProps={{
          className: "custom-dropdown", // Добавляем кастомный класс
        }}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

