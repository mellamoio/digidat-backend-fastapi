import type { QueryStringParams } from '../types/requests'

export const setQueryParams = (
    params: QueryStringParams,
    baseUrl: string
): string => {
    const queryParams = new URLSearchParams()
    for (const key in params) {
        if (params[key] === undefined) {
            continue
        }
        if (typeof params[key] === 'string') {
            queryParams.append(key, params[key])
        }
        if (Array.isArray(params[key])) {
            params[key].forEach((item) => {
                queryParams.append(`${key}[]`, item)
            })
        }
    }
    const url = `${baseUrl}?${queryParams.toString()}`
    return url
}
