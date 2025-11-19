import type { ReactNode } from 'react'
import DataTable, { type TableColumn } from 'react-data-table-component'
import type {
    PaginationChangePage,
    PaginationChangeRowsPerPage
} from 'react-data-table-component/dist/DataTable/types'
import { FaEdit, FaTrashAlt, FaEye, FaUpload, FaArrowRight } from 'react-icons/fa'
import './index.css'

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
    onPageChange: PaginationChangePage
    onRowsPerPageChange: PaginationChangeRowsPerPage
    onEdit?: (row: T) => void
    onDelete?: (row: T) => void
    onView?: (row: T) => void
    onUpload?: (row: T) => void
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
    onUpload,
    onViewComponent,
    emptyText,
    stickyColumns,
    customAction,
    selectable,
    customSelect,
    onChangeCheckbox
}: DataTableCustomProps<T>) => {
    const actionColumn: TableColumn<T> = {
        name: 'Detalles',
        center: true,
        grow: 0,
        width: '130px',
        cell: (row: T) => (
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                alignItems: 'center' 
            }}>
                {customAction && customAction(row)}
                
                {onView && (
                    <button
                        onClick={() => onView(row)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            color: '#595959'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                            e.currentTarget.style.color = '#722AE9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#595959';
                        }}
                        title="Ver"
                    >
                        <FaEye size={14} />
                    </button>
                )}
                
                {onEdit && (
                    <button
                        onClick={() => onEdit(row)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            color: '#595959'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                            e.currentTarget.style.color = '#1890ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#595959';
                        }}
                        title="Editar"
                    >
                        <FaEdit size={14} />
                    </button>
                )}
                
                {onUpload && (
                    <button
                        onClick={() => onUpload(row)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            color: '#595959'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                            e.currentTarget.style.color = '#52c41a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#595959';
                        }}
                        title="Subir"
                    >
                        <FaUpload size={14} />
                    </button>
                )}
                
                {onDelete && (
                    <button
                        onClick={() => onDelete(row)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            color: '#595959'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff1f0';
                            e.currentTarget.style.color = '#ff4d4f';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#595959';
                        }}
                        title="Eliminar"
                    >
                        <FaTrashAlt size={14} />
                    </button>
                )}
                
                {onViewComponent && (
                    <button
                        onClick={() => onViewComponent(row)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            color: '#722AE9'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0e6ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Ver detalles"
                    >
                        <FaArrowRight size={14} />
                    </button>
                )}
            </div>
        )
    }

    const newColumns =
        onDelete || onView || onEdit || onViewComponent || onUpload
            ? [...columns, actionColumn]
            : columns

    return (
        <div className={stickyColumns ? 'data-table-responsive' : ''}>
            <DataTable
                title={title}
                customStyles={{
                    headRow: { 
                        style: { 
                            backgroundColor: '#F1F1F1',
                            minHeight: '52px'
                        } 
                    },
                    headCells: { 
                        style: { 
                            backgroundColor: '#F1F1F1',
                            fontWeight: '600',
                            fontSize: '14px'
                        } 
                    },
                    rows: {
                        style: {
                            minHeight: '48px'
                        }
                    },
                    cells: {
                        style: {
                            fontSize: '14px'
                        }
                    }
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
                noDataComponent={<div style={{ padding: '24px' }}>{emptyText}</div>}
                selectableRows={selectable}
                selectableRowSelected={customSelect}
                onSelectedRowsChange={onChangeCheckbox}
                className="table-bordered table-hover"
            />
        </div>
    )
}