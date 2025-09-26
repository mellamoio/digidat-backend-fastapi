import { type ReactNode, useState, useEffect, useMemo } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";

type WordBreak = "normal" | "break-all" | "keep-all" | "break-word";

export interface DataRow {
  id: number;
  estado: string;
  [key: string]: any;
}

interface DataTableCustomProps<T extends DataRow> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  emptyText: string;
  stickyColumns?: boolean;
  customAction?: (row: T) => ReactNode;
  selectable?: boolean;
  disableStatusColumn?: boolean;
  customSelect?: (row: T) => boolean;
  onChangeCheckbox?: (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
}

export const DataTableCustom = <T extends DataRow>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  emptyText,
  stickyColumns,
  customAction,
  selectable,
  customSelect,
  disableStatusColumn,
  onChangeCheckbox,
}: DataTableCustomProps<T>) => {
  const [tableData, setTableData] = useState<T[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const memoizedColumns: TableColumn<T>[] = useMemo(() => {
    const baseColumns = [...columns];

    const firstColumn: TableColumn<T> = {
      ...baseColumns[0],
      minWidth: "50px",
      maxWidth: "70px",
      style: stickyColumns
        ? {
            position: "sticky" as const,
            left: 0,
            zIndex: 400,
            minWidth: "50px",
            maxWidth: "70px",
            padding: "8px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #D9D9D9",
          }
        : undefined,
    };

    const updatedColumns = baseColumns.slice(1).map((col, index) => {
      if (index === 0) {
        return {
          ...col,
          wrap: true,
          style: {
            ...col.style,
            whiteSpace: "normal" as const,
            wordBreak: "break-word" as WordBreak,
          },
        };
      }
      if (index === 1) {
        return {
          ...col,
          minWidth: "100px",
          maxWidth: "100px",
          style: {
            ...col.style,
            textAlign: "center" as const,
          },
        };
      }
      return { ...col };
    });

    const actionColumn: TableColumn<T> = {
      name: "Opciones",
      center: true,
      grow: 0,
      minWidth: "130px",
      style: stickyColumns
        ? {
            position: "sticky" as const,
            right: 0,
            zIndex: 400,
            minWidth: "130px",
            backgroundColor: "#fff",
            borderLeft: "1px solid #D9D9D9",
          }
        : undefined,
      cell: (row: T) => (
        <div style={{ display: "flex", gap: "4px" }}>
          {customAction && customAction(row)}
          {onView && (
            <button className="md-button md-button--icon" onClick={() => onView(row)}>
              <i className="mdi mdi-eye" title="Ver"></i>
            </button>
          )}
          {onEdit && (
            <button className="md-button md-button--icon" onClick={() => onEdit(row)}>
              <i className="mdi mdi-pencil" title="Editar"></i>
            </button>
          )}
          {onDelete && (
            <button className="md-button md-button--icon hidden-xs" onClick={() => onDelete(row)}>
              <i className="mdi mdi-delete" title="Eliminar"></i>
            </button>
          )}
        </div>
      ),
    };

    const finalColumns = [
      firstColumn,
      ...updatedColumns,
      ...(onDelete || onEdit || onView || customAction ? [actionColumn] : []),
    ];
    return finalColumns;
  }, [columns, stickyColumns, onEdit, onDelete, onView, customAction]);

  return (
    <div style={{ border: "1px solid #D1D1D1", borderRadius: "5px", overflow: "hidden" }}>
      <DataTable
        customStyles={{
          headRow: { style: { backgroundColor: "#F1F1F1" } },
          headCells: { style: { backgroundColor: "#F1F1F1" } },
        }}
        columns={memoizedColumns}
        data={tableData}
        noDataComponent={<div>{emptyText}</div>}
        selectableRows={selectable}
        selectableRowSelected={customSelect}
        onSelectedRowsChange={onChangeCheckbox}
      />
    </div>
  );
};

export default DataTableCustom;