import { type ReactNode } from 'react'
import DataTable, { 
    type TableColumn} from 'react-data-table-component'

export interface DataRow {
    [key: string]: any
}

interface DataTableCustomProps<T extends DataRow> {
    title: string
    columns: TableColumn<T>[]
    data: T[]
    totalRows: number
    currentPage: number
    rowsPerPage: number
    onPageChange: (page: number) => void
    onRowsPerPageChange: (rowsPerPage: number, currentPage: number) => void
    onEdit?: (row: T) => void
    onDelete?: (row: T) => void
    onView?: (row: T) => void
    onViewComponent?: (row: T) => void
    emptyText: string
    stickyColumns?: boolean
    customAction?: (row: T) => ReactNode
    selectable?: boolean
    customSelect?: (row: T) => boolean
    onChangeCheckbox?: (selected: {
        allSelected: boolean
        selectedCount: number
        selectedRows: T[]
    }) => void
}

export const DataTableCustom = <T extends DataRow>({
    title,
    columns,
    data,
    totalRows,
    currentPage,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onDelete,
    onView,
    onViewComponent,
    emptyText,
    stickyColumns,
    customAction,
    selectable,
    customSelect,
    onChangeCheckbox
}: DataTableCustomProps<T>) => {
    const actionColumn: TableColumn<T> = {
        name: 'Opciones',
        center: true,
        grow: 0,
        minWidth: '130px',
        style: stickyColumns
            ? {
                  position: 'sticky',
                  right: 0,
                  zIndex: 400,
                  minWidth: '130px',
                  backgroundColor: '#fff',
                  borderLeft: '1px solid #D9D9D9'
              }
            : undefined,
        cell: (row: T) => (
            <div style={{ display: 'flex', gap: '4px' }}>
                {customAction && customAction(row)}
                {onView && (
                    <a
                        className="md-button md-button--icon"
                        data-toggle="tooltip"
                        data-placement="left"
                        data-original-title="Ver"
                        data-action={row?.actionView ?? 'verPago'}
                        data-id={row.id}
                        onClick={() => onView(row)}
                    >
                        <i className="mdi mdi-eye"></i>
                    </a>
                )}
                {onEdit && (
                    <a
                        className="md-button md-button--icon"
                        data-toggle="tooltip"
                        data-placement="left"
                        data-original-title="Editar"
                        data-action={row?.actionEdit ?? 'agregarEditarPago'}
                        action-after="reloadPagos"
                        data-id={row.id}
                        onClick={() => onEdit(row)}
                    >
                        <i className="mdi mdi-pencil"></i>
                    </a>
                )}
                {onDelete && (
                    <a
                        className="md-button md-button--icon hidden-xs"
                        data-toggle="tooltip"
                        data-placement="left"
                        data-original-title="Eliminar"
                        data-action={row?.actionDelete ?? 'eliminarPago'}
                        action-after="reloadPagos"
                        data-id={row.id}
                        onClick={() => onDelete(row)}
                    >
                        <i className="mdi mdi-delete"></i>
                    </a>
                )}
                {onViewComponent && (
                    <a
                        className="md-button md-button--icon hidden-xs"
                        data-toggle="tooltip"
                        data-placement="left"
                        data-original-title="Ver"
                        data-id={row.id}
                        onClick={() => onViewComponent(row)}
                    >
                        <i
                            className="mdi mdi-arrow-right"
                            style={{ color: '#2e2eda' }}
                        ></i>
                    </a>
                )}
            </div>
        )
    }

    const firstColumn: TableColumn<T> = {
        ...columns[0],
        style: stickyColumns
            ? {
                  position: 'sticky',
                  left: 0,
                  zIndex: 400,
                  minWidth: '200px',
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRight: '1px solid #D9D9D9'
              }
            : undefined
    }

    const newColumns =
        onDelete || onView || onEdit || onViewComponent
            ? [firstColumn, ...columns.slice(1), actionColumn]
            : columns

    return (
        <DataTable
            title={title}
            customStyles={{
                headRow: { style: { backgroundColor: '#F1F1F1' } },
                headCells: { style: { backgroundColor: '#F1F1F1' } }
            }}
            columns={newColumns}
            data={data}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            paginationPerPage={rowsPerPage}
            paginationDefaultPage={currentPage}
            paginationComponentOptions={{
                rowsPerPageText: 'Filas por página',
                rangeSeparatorText: 'de',
                noRowsPerPage: false,
                selectAllRowsItemText: 'Todos'
            }}
            onChangePage={onPageChange}
            onChangeRowsPerPage={onRowsPerPageChange}
            noDataComponent={<div>{emptyText}</div>}
            selectableRows={selectable}
            selectableRowSelected={customSelect}
            onSelectedRowsChange={onChangeCheckbox}
            className={`table table-bordered table-hover ${stickyColumns ? 'sticky-table' : ''}`}
        />
    )
}
