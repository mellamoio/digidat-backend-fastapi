import dayjs from 'dayjs'

const isSameOrAfter = (a: dayjs.Dayjs, b: dayjs.Dayjs): boolean => {
    return a.isSame(b, 'day') || a.isAfter(b, 'day')
}

const isSameOrBefore = (a: dayjs.Dayjs, b: dayjs.Dayjs): boolean => {
    return a.isSame(b, 'day') || a.isBefore(b, 'day')
}

export const filterDateRange = (
    date_start: string,
    date_end: string | null,
    filter_start: string | undefined,
    filter_end: string | undefined
): boolean => {
    if (!(filter_start || filter_end)) return false
    const dateStart = dayjs(date_start)
    const dateEnd = date_end ? dayjs(date_end) : null
    const filterStart = dayjs(filter_start)
    const filterEnd = dayjs(filter_end)

    if (!dateEnd) {
        return true // no ha concluido
    }

    return (
        (isSameOrAfter(dateStart, filterStart) &&
            isSameOrBefore(dateEnd, filterEnd)) || // ambas fecha en el rango
        (isSameOrAfter(dateStart, filterStart) &&
            isSameOrBefore(dateStart, filterEnd)) || // fecha inicial en el rango
        (isSameOrAfter(dateEnd, filterStart) &&
            isSameOrBefore(dateEnd, filterEnd)) || // fecha final en el rango
        (dateStart.isBefore(filterStart) && dateEnd.isAfter(filterEnd)) // rango de fechas cubren el rango del filtro
    )
}
