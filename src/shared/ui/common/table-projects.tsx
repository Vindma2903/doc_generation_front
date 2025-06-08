import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import ProjectDrop from "@/shared/ui/common/project-drop"; // Импортируем ProjectDrop

type UniversalTableProps<T> = {
  columns: Array<{ name: string; uid: keyof T | string; sortable?: boolean }>;
  data: T[];
  renderCell?: (item: T, columnKey: keyof T | string) => React.ReactNode;
  onRowClick?: (item: T) => void;
  emptyContent?: string;
};

function UniversalTable<T>({
  columns,
  data,
  renderCell,
  onRowClick,
  emptyContent = "Нет данных",
}: UniversalTableProps<T>) {
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof T | string;
    direction: "ascending" | "descending";
  }>({
    column: columns[0]?.uid || "",
    direction: "ascending",
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const sortedItems = useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);

  const handleSort = useCallback(
    (columnKey: keyof T | string) => {
      if (sortDescriptor.column === columnKey) {
        setSortDescriptor((prev) => ({
          ...prev,
          direction: prev.direction === "ascending" ? "descending" : "ascending",
        }));
      } else {
        setSortDescriptor({ column: columnKey, direction: "ascending" });
      }
    },
    [sortDescriptor]
  );

  return (
    <div>
      <Table aria-label="Universal Table">
        <TableHeader
          columns={columns}
          style={{
            backgroundColor: "#DCE0E5", // Цвет фона
            borderTopLeftRadius: "8px", // Закругление слева сверху
            borderTopRightRadius: "8px", // Закругление справа сверху
          }}
        >
          {(column) => (
            <TableColumn
              key={column.uid as string}
              allowsSorting={column.sortable}
              onClick={() => column.sortable && handleSort(column.uid)}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={emptyContent} items={sortedItems}>
          {(item) => (
            <TableRow key={(item as any).id} onClick={() => onRowClick?.(item)}>
              {(columnKey) => (
                <TableCell>
                  {renderCell ? renderCell(item, columnKey) : (item as any)[columnKey]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {activeProjectId && (
        <ProjectDrop
          projectId={activeProjectId}
          onClose={() => setActiveProjectId(null)}
        />
      )}
    </div>
  );
}

export default UniversalTable;
