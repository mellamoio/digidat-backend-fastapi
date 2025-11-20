import React, {
    createContext,
    useState,
    useContext,
    type ReactNode,
    useEffect,
    useMemo
} from 'react'
import useSWR from 'swr'
import apiClient from '../api/api'
import { useSatelite } from './DigidatContext'
import type { Obra, ObraResponse } from '../types/obra'
import dayjs from 'dayjs'
import { filterDateRange } from '../helpers/filterDateRange'
import { getObra } from '../services/getObra.service'

interface TipoGasto {
    id: number
    name: string
    id_empresa?: number
    created_at?: string | null
    updated_at?: string | null
}

interface KpisObras {
    totalObras: number
    montoProyectos: number
    montoPagado: number
    montoRecuperado: number
}

interface ObrasContextType {
    empresaId: string
    obras: Obra[] | null
    obrasOriginales: Obra[] | null
    obrasFiltradas: Obra[] | null
    kpis: KpisObras | null
    setKpis: (kpis: KpisObras) => void
    params: {
        usuarios?: string[]
        centros_operacion?: string[]
        tipo?: string
        anio?: string
        obra_id?: number
        fecha_reembolso?: string
        fecha_conclusion?: string
        concepto?: string
    }
    setParams: (newParams: Partial<ObrasContextType['params']>) => void
    resetFilters: () => void
    setObrasFiltradas: React.Dispatch<React.SetStateAction<Obra[] | null>>
    agregarObra: (nuevaObra: Obra) => void
    selectedId: number | null
    setSelectedId: (id: number | null) => void
    tiposGastoData: TipoGasto[] | null
}

const ObrasContext = createContext<ObrasContextType | undefined>(undefined)

const transformObraResponse = (response: ObraResponse): Obra => {
    return {
        id: response.id_obra,
        nombre: response.nombre,
        tipo_id: response.tipo_id,
        estado_id: response.estado_id,
        costo_proyecto: response.costo_proyecto.toString(),
        fecha_reembolso: response.fecha_inicio || undefined,
        fecha_conclusion: response.fecha_fin || '',
        usuarios: response.responsable 
            ? [{ id: response.responsable.id_responsable, nombre: response.responsable.nombre }]
            : [],
        centros_operacion: response.centros_operacion || [],
        id_empresa: response.id_empresa,
        monto_recuperado: 0,
        monto_pagado: 0
    }
}

export const ObrasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { empresaId: contextEmpresaId } = useSatelite()
    const empresaId = contextEmpresaId || '1'

    const [params, setParams] = useState<ObrasContextType['params']>({
        obra_id: undefined,
        tipo: undefined,
        usuarios: undefined,
        centros_operacion: undefined,
        anio: undefined,
        fecha_reembolso: undefined,
        fecha_conclusion: undefined,
        concepto: undefined,
    })
    const [obrasOriginales, setObrasOriginales] = useState<Obra[] | null>(null)
    const [obrasFiltradas, setObrasFiltradas] = useState<Obra[] | null>(null)
    const [kpis, setKpis] = useState<KpisObras | null>(null)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const { data: obrasResponseData, mutate: mutateObras } = useSWR(
        [`v1/obras/`, empresaId],
        () => getObra({ id_empresa: parseInt(empresaId) }),
        { revalidateOnFocus: false }
    )

    const obrasData = useMemo(() => {
        if (!obrasResponseData) return null
        return obrasResponseData.map(transformObraResponse)
    }, [obrasResponseData])

    const { data: tiposGastoData } = useSWR(
        [`/all/tipogasto`, empresaId],
        () =>
            apiClient
                .get('/all/tipogasto', { params: { id_empresa: empresaId } })
                .then((res) => res.data.data),
        { revalidateOnFocus: false }
    )

    useEffect(() => {
        setObrasOriginales(obrasData || null)
    }, [obrasData])

    const applyFilters = (obras: Obra[]): Obra[] => {
        let filtered = [...obras].filter((obra): obra is Obra => obra !== undefined)

        if (selectedId !== null && selectedId !== 0) {
            filtered = filtered.filter((obra) => obra.estado_id === selectedId)
        }

        if (params.obra_id) {
            filtered = filtered.filter((obra) => obra.id === params.obra_id)
        }

        if (params.tipo) {
            filtered = filtered.filter((obra) => obra.tipo_id.toString() === params.tipo)
        }

        if (params.anio || params.fecha_conclusion || params.fecha_reembolso) {
            filtered = filtered.filter((obra) => {
                if (!obra.fecha_reembolso) return false
                return filterDateRange(
                    obra.fecha_reembolso,
                    obra.fecha_conclusion,
                    params.fecha_reembolso,
                    params.fecha_conclusion
                )
            })
        }

        if (params.usuarios && params.usuarios.length > 0) {
            filtered = filtered.filter((obra) => {
                if (!obra.usuarios || !Array.isArray(obra.usuarios)) return false
                return obra.usuarios.some((usuario) =>
                    params.usuarios!.includes(usuario.id.toString())
                )
            })
        }

        if (params.centros_operacion && params.centros_operacion.length > 0) {
            filtered = filtered.filter((obra) => {
                if (!obra.centros_operacion || !Array.isArray(obra.centros_operacion)) return false
                return obra.centros_operacion.some((centro) =>
                    params.centros_operacion!.includes(centro.id.toString())
                )
            })
        }

        return filtered
    }

    useEffect(() => {
        if (!obrasData) {
            setObrasFiltradas([])
            return
        }

        const filteredObras = applyFilters(obrasData)
        setObrasFiltradas(filteredObras)
    }, [obrasData, params, selectedId])

    const tiposGastoFiltrados = useMemo(() => {
        if (!tiposGastoData || !obrasFiltradas) return null

        let filtered = [...tiposGastoData]
        const obraIds = obrasFiltradas.map((obra) => obra.id)

        filtered = filtered.filter(
            (tipoGasto: TipoGasto & { id_obra?: number }) =>
                obraIds.includes(tipoGasto.id_obra!)
        )

        if (params.fecha_conclusion && params.fecha_reembolso) {
            filtered = filtered.filter((tipoGasto: TipoGasto) => {
                const tipoGastoFecha = tipoGasto.created_at ? dayjs(tipoGasto.created_at) : null
                if (!tipoGastoFecha) return false
                const fechaInicio = dayjs(params.fecha_reembolso)
                const fechaFin = dayjs(params.fecha_conclusion)
                return (
                    tipoGastoFecha.isAfter(fechaInicio, 'day') &&
                    tipoGastoFecha.isBefore(fechaFin, 'day')
                )
            })
        }

        return filtered
    }, [tiposGastoData, params.fecha_conclusion, params.fecha_reembolso, obrasFiltradas])

    const kpisIniciales = useMemo(() => {
        const validObrasFiltradas = obrasFiltradas
            ? obrasFiltradas.filter((obra): obra is Obra => obra !== undefined)
            : []

        return {
            totalObras: validObrasFiltradas.length,
            montoProyectos: validObrasFiltradas.reduce((sum: number, obra: Obra) => {
                const costo = Number(
                    obra.costo_proyecto?.toString().replace(/[^0-9.-]+/g, '') || 0
                )
                return sum + (isNaN(costo) ? 0 : costo)
            }, 0),
            montoPagado: tiposGastoFiltrados
                ? tiposGastoFiltrados.reduce(
                      (sum: number, tipoGasto: any) => sum + (tipoGasto.monto_pagado || 0),
                      0
                  )
                : 0,
            montoRecuperado: validObrasFiltradas.reduce(
                (sum: number, obra: Obra) => sum + (obra.monto_recuperado || 0),
                0
            )
        }
    }, [obrasOriginales, obrasFiltradas, tiposGastoFiltrados])

    useEffect(() => {
        setKpis(kpisIniciales)
    }, [kpisIniciales])

    const resetFilters = () => {
        setParams({
            usuarios: undefined,
            centros_operacion: undefined,
            tipo: undefined,
            anio: undefined,
            obra_id: undefined,
            fecha_reembolso: undefined,
            fecha_conclusion: undefined,
            concepto: undefined,
        })
        setSelectedId(null)
    }

    const agregarObra = (nuevaObra: Obra) => {
        if (!nuevaObra) {
            console.error('nuevaObra es null o undefined')
            return
        }

        const normalizedObra: Obra = {
            id: nuevaObra.id || 0,
            nombre: nuevaObra.nombre || 'Sin nombre',
            tipo_id: nuevaObra.tipo_id || 0,
            estado_id: nuevaObra.estado_id || 0,
            costo_proyecto: nuevaObra.costo_proyecto?.toString() || '0',
            fecha_reembolso: nuevaObra.fecha_reembolso || undefined,
            fecha_conclusion: nuevaObra.fecha_conclusion || '',
            usuarios: nuevaObra.usuarios || [],
            centros_operacion: nuevaObra.centros_operacion || [],
            id_empresa: nuevaObra.id_empresa || parseInt(empresaId),
            monto_recuperado: nuevaObra.monto_recuperado || 0,
            monto_pagado: nuevaObra.monto_pagado || 0
        }

        const nuevasObras = obrasData
            ? [...obrasData, normalizedObra].filter((obra): obra is Obra => obra !== undefined)
            : [normalizedObra]
        
        mutateObras(nuevasObras as any, false)

        setObrasOriginales(nuevasObras)

        const filteredObras = applyFilters(nuevasObras)
        setObrasFiltradas(filteredObras)
    }

    return (
        <ObrasContext.Provider
            value={{
                empresaId,
                obras: obrasData || null,
                obrasOriginales,
                obrasFiltradas,
                kpis,
                setKpis,
                params,
                setParams,
                resetFilters,
                setObrasFiltradas,
                agregarObra,
                selectedId,
                setSelectedId,
                tiposGastoData
            }}
        >
            {children}
        </ObrasContext.Provider>
    )
}

export const useObras = (): ObrasContextType => {
    const context = useContext(ObrasContext)
    if (context === undefined) {
        throw new Error('useObras debe usarse dentro de un ObrasProvider')
    }
    return context
}