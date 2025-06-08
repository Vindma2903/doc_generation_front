export const DeleteArea: React.FC<{ isDragging: boolean; isOverDeleteArea: boolean }> = ({
  isDragging,
  isOverDeleteArea,
}) => {
  return (
    <div
      className={`delete-area ${isDragging ? "active" : ""} ${
        isOverDeleteArea ? "highlight" : ""
      }`}
    >
      {isOverDeleteArea ? (
        <span className="delete-text">Отпустите для удаления</span>
      ) : (
        <span className="delete-text">Перетащите сюда для удаления</span>
      )}
    </div>
  );
};
