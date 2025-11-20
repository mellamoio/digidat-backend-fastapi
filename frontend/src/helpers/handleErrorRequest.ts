import { AxiosError } from 'axios'

export const handleErrorRequest = (error: unknown): string => {
    let message = 'Ha ocurrido un error en la petición'
    if (error instanceof AxiosError) {
        if (error.response) {
            message = `Error: ${error.response.status} - ${error.response.statusText}`
        } else if (error.request) {
            message = 'Error: No se recibió respuesta del servidor'
        } else {
            message = 'Error: No se pudo realizar la solicitud'
        }
    }
    if (error instanceof Error) {
        message = error.message
    }
    return message
}
