import { AxiosError } from 'axios'

export const handleErrorRequest = (error: unknown): string => {
    let message = 'Ha ocurrido un error en la petición'
    if (error instanceof AxiosError) {
        if (error.response) {
            // El servidor ha respondido con un estado de error
            message = `Error: ${error.response.status} - ${error.response.statusText}`
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            message = 'Error: No se recibió respuesta del servidor'
        } else {
            // Ocurrió un error durante la configuración de la solicitud
            message = 'Error: No se pudo realizar la solicitud'
        }
    }
    if (error instanceof Error) {
        message = error.message
    }
    return message
}
