import { useEffect, useState } from 'react'
import type {
    PaginationChangePage,
    PaginationChangeRowsPerPage
} from 'react-data-table-component/dist/DataTable/types'
export const usePagination = <GenericType>(
    data: Array<GenericType> | null,
    mappingCallback?: (
        value: GenericType,
        index: number,
        array: GenericType[]
    ) => GenericType,
    initialCurrentPage: number = 1,
    initialRowsTotal: number = 0,
    initialRowsPage: number = 12
) => {
    const [rows, setRows] = useState<Array<GenericType>>([])
    const [currentPage, setCurrentPage] = useState(initialCurrentPage)
    const [rowsTotal, setRowsTotal] = useState(initialRowsTotal)
    const [rowsPage, setRowsPage] = useState(initialRowsPage)
    useEffect(() => {
        if (data) {
            setRowsTotal(data.length)
            setRows(
                mappingCallback
                    ? data
                          .filter(
                              (_, index) =>
                                  index >= (currentPage - 1) * rowsPage &&
                                  index < currentPage * rowsPage
                          )
                          .map(mappingCallback)
                    : data.filter(
                          (_, index) =>
                              index >= (currentPage - 1) * rowsPage &&
                              index < currentPage * rowsPage
                      )
            )
        }
    }, [currentPage, rowsPage, data, mappingCallback])
    const handlePageChange: PaginationChangePage = (page) => {
        setCurrentPage(page)
    }

    const handleRowsPerPageChange: PaginationChangeRowsPerPage = (
        newRowsPerPage,
        page
    ) => {
        setRowsPage(newRowsPerPage)
        setCurrentPage(page)
    }
    return {
        rows,
        currentPage,
        rowsTotal,
        rowsPage,
        handlePageChange,
        handleRowsPerPageChange
    }
}
