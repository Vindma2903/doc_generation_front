// board-crm.tsx
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult, DragUpdate } from "react-beautiful-dnd";
import Column from "@/shared/ui/crm/add-deal";
import { DeleteArea } from "@/shared/ui/crm/delete-task";
import TaskDetailsModal from "@/shared/ui/common/TaskDetailsModal";
import { fetchDeals } from "@/shared/api/crm";
import "@/shared/styles/kanban.css";

interface Deal {
  id: string;
  title: string;
  name: string;
  phone: string;
  amount: number;
  columnId: string;
  createdAt: Date;
}

interface ColumnType {
  id: string;
  title: string;
  deals: Deal[];
}

export const BoardCRM: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDeleteArea, setIsOverDeleteArea] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // ✅ Загружаем сделки при загрузке страницы
  useEffect(() => {
    const loadDeals = async () => {
      const loadedDeals = await fetchDeals();
      const groupedDeals = loadedDeals.reduce<Record<string, Deal[]>>((acc, deal) => {
        const columnId = deal.columnId || "column-1";
        if (!acc[columnId]) acc[columnId] = [];
        acc[columnId].push(deal);
        return acc;
      }, {});

      const storedColumns = [
        { id: "column-1", title: "Новая заявка", deals: groupedDeals["column-1"] || [] },
        { id: "column-2", title: "В работе", deals: groupedDeals["column-2"] || [] },
        { id: "column-3", title: "Оплачено", deals: groupedDeals["column-3"] || [] },
      ];

      setColumns(storedColumns);
    };

    loadDeals();
  }, []);

  const onDragStart = () => {
    setIsDragging(true);
    document.body.style.overflow = "hidden";
  };

  const onDragUpdate = (update: DragUpdate) => {
    const deleteArea = document.querySelector(".delete-area");
    if (!deleteArea) return;

    const deleteAreaRect = deleteArea.getBoundingClientRect();
    const draggedElement = document.querySelector(`[data-rbd-drag-handle-draggable-id='${update.draggableId}']`);

    if (!draggedElement) return;

    const draggedRect = draggedElement.getBoundingClientRect();
    const isOverlapping =
      draggedRect.bottom > deleteAreaRect.top &&
      draggedRect.top < deleteAreaRect.bottom &&
      draggedRect.right > deleteAreaRect.left &&
      draggedRect.left < deleteAreaRect.right;

    setIsOverDeleteArea(isOverlapping);
    draggedElement.classList.toggle("task-dragging-over-delete-area", isOverlapping);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    document.body.style.overflow = "auto";

    const draggedElement = document.querySelector(`[data-rbd-drag-handle-draggable-id='${result.draggableId}']`);
    if (draggedElement) draggedElement.classList.remove("task-dragging-over-delete-area");

    if (isOverDeleteArea) {
      const deal = columns.flatMap(col => col.deals).find(deal => deal.id === result.draggableId);
      if (deal) {
        setDealToDelete(deal);
      }
      setIsOverDeleteArea(false);
      return;
    }

    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumnIndex = columns.findIndex(col => col.id === source.droppableId);
    const destColumnIndex = columns.findIndex(col => col.id === destination.droppableId);

    if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];

    const sourceDeals = Array.from(sourceColumn.deals);
    const destDeals = Array.from(destColumn.deals);

    const [movedDeal] = sourceDeals.splice(source.index, 1);
    movedDeal.columnId = destination.droppableId; // ✅ Обновляем columnId

    destDeals.splice(destination.index, 0, movedDeal);

    setColumns(prev => {
      const updatedColumns = [...prev];
      updatedColumns[sourceColumnIndex] = { ...sourceColumn, deals: sourceDeals };
      updatedColumns[destColumnIndex] = { ...destColumn, deals: destDeals };
      return updatedColumns;
    });
  };

  const handleAddDeal = (columnId: string, newDeal: Deal) => {
    setColumns(prev =>
      prev.map(column =>
        column.id === columnId
          ? { ...column, deals: [newDeal, ...column.deals] }
          : column
      )
    );
  };

  const handleConfirmDelete = () => {
    if (!dealToDelete) return;
    setColumns(prev =>
      prev.map(column => ({
        ...column,
        deals: column.deals.filter(deal => deal.id !== dealToDelete.id),
      }))
    );
    setDealToDelete(null);
  };

  const handleCancelDelete = () => {
    setDealToDelete(null);
  };

  const openDealDetails = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const closeDealDetails = () => {
    setSelectedDeal(null);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <div className="board-container">
        {columns.map(column => (
          <div className="column-container" key={column.id}>
            <Column
              id={column.id}
              title={column.title}
              deals={column.deals} // ✅ Передаём сделки
              onAddDeal={handleAddDeal} // ✅ Позволяем добавлять сделки
              onDealClick={openDealDetails}
            />
          </div>
        ))}

        <DeleteArea isDragging={isDragging} isOverDeleteArea={isOverDeleteArea} />
      </div>

      {dealToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-content">
              <h3 className="delete-modal-title">Удаление сделки</h3>
              <p className="delete-modal-text">Вы уверены, что хотите удалить сделку "{dealToDelete.title}"?</p>
              <div className="delete-modal-buttons">
                <button className="delete-modal-cancel" onClick={handleCancelDelete}>Отменить</button>
                <button className="delete-modal-confirm" onClick={handleConfirmDelete}>Удалить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDeal && (
        <TaskDetailsModal
          deal={selectedDeal}
          onClose={closeDealDetails}
          onSave={updatedDeal => {
            setColumns(prev =>
              prev.map(col => ({
                ...col,
                deals: col.deals.map(d => d.id === updatedDeal.id ? updatedDeal : d),
              }))
            );
          }}
        />
      )}
    </DragDropContext>
  );
};
