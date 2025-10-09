import { setQueryParams } from '../helpers/setQueryParams'
import { handleErrorRequest } from '../helpers/handleErrorRequest'
import type { Obra, ObraResponse } from '../types/obra'
import apiClient from '../api/api'
import type { ResponseError, ResponseSuccess } from '../types/responses'

interface GetObrasRequest {
    id_empresa: number
    unidades_gestion?: string[]
}

export const getObra = async ({
    id_empresa,
    unidades_gestion
}: GetObrasRequest): Promise<ObraResponse[]> => {
    try {
        const params = {
            id_empresa: id_empresa.toString(),
            unidades_gestion: unidades_gestion?.map((el) => el.toString())
        }

        const url = setQueryParams(params, '/all/obra')

        const { data } = await apiClient.get<any>(url)

        if (!data.success) {
            throw new Error(data.success)
        }

        return data.data.filter((obra: Obra) => obra !== undefined)
    } catch (e) {
        throw handleErrorRequest(e)
    }
}

export const createObra = async (
    obraData: Obra
): Promise<any> => {
    try {
        const response = await apiClient.post(
            '/add/obra',
            obraData
        )
        return response.data
    } catch (error: any) {
        console.error('Error al crear la obra por impuesto:', error)
        throw new Error(
            error.response?.data?.message ||
                'Error al crear la obra por impuesto'
        )
    }
}

export const editObra = async (
    obraData: Obra
): Promise<any> => {
    try {
        const response = await apiClient.post('/edit/obra', obraData)
        return response.data
    } catch (error: any) {
        console.error('Error al actualizar la obra por impuesto:', error)
        throw new Error(
            error.response?.data?.message ||
                'Error al actualizar la obra por impuesto'
        )
    }
}

export const deleteObra = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.post('/delete/obra', { id })
        return response.data
    } catch (error: any) {
        console.error('Error al eliminar la obra por impuesto:', error)
        throw new Error(
            error.response?.data?.message ||
                'Error al eliminar la obra por impuesto'
        )
    }
}
