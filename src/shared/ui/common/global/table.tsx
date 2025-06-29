import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
  getKeyValue,
} from "@heroui/react";

type Column<T> = {
  name: string;
  uid: keyof T | string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  items: T[];
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  onRowClick?: (item: T) => void;
  ariaLabel?: string;
  itemsPerPage?: number;
  onSelectionChange?: (selectedItems: T[]) => void;
}

export function DataTable<T extends { id: number | string }>({
                                                               columns,
                                                               items,
                                                               renderCell,
                                                               onRowClick,
                                                               ariaLabel = "Динамическая таблица",
                                                               itemsPerPage = 15,
                                                               onSelectionChange,
                                                             }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
    const selected = new Set([...keys]);
    const selectedItems = items.filter((item) => selected.has(String(item.id)));
    onSelectionChange?.(selectedItems);
  };

  // Сортировка
  const sortedItems = React.useMemo(() => {
    if (!sortDescriptor.column) return items;
    const sorted = [...items].sort((a, b) => {
      const aValue = getKeyValue(a, sortDescriptor.column as keyof T);
      const bValue = getKeyValue(b, sortDescriptor.column as keyof T);

      let cmp = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        cmp = aValue - bValue;
      } else {
        cmp = String(aValue).localeCompare(String(bValue));
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
    return sorted;
  }, [items, sortDescriptor]);

  // Пагинация
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Table
        aria-label={ariaLabel}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        color="primary"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid.toString()}
              align={column.align || "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={paginatedItems}>
          {(item) => (
            <TableRow
              key={item.id.toString()}
              onClick={() => onRowClick?.(item)}
              className="table-row"
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell
                    ? renderCell(item, columnKey.toString())
                    : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="pagination-controls mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Назад
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={page === currentPage ? "active-page" : ""}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Вперёд
        </button>
      </div>
    </>
  );
}
