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
import type { Obra } from '../types/obra'
import dayjs from 'dayjs'
import { filterDateRange } from '../helpers/filterDateRange'
import { getObrasPorImpuesto } from '../services/getObraPorImpuesto.service'
import { useSearchParams } from 'react-router-dom'

interface TipoGasto {
    id: number
    name: string
    id_empresa?: number
    created_at?: string | null
    updated_at?: string | null
}

interface KpisSatelite {
    totalObras: number
    montoProyectos: number
    montoPagado: number
    montoRecuperado: number
}

interface SateliteActoresContextType {
    empresaId: string
    obras: Obra[] | null
    obrasOriginales: Obra[] | null
    obrasFiltradas: Obra[] | null
    kpis: KpisSatelite | null
    setKpis: (kpis: KpisSatelite) => void
    params: {
        responsables?: string[]
        tipo?: string
        anio?: string
        obra_id?: number
        fecha_reembolso?: string
        fecha_conclusion?: string
        concepto?: string
    }
    setParams: (
        newParams: Partial<SateliteActoresContextType['params']>
    ) => void
    resetFilters: () => void
    setObrasFiltradas: React.Dispatch<React.SetStateAction<Obra[] | null>>
    agregarObra: (nuevaObra: Obra) => void
    selectedId: number | null
    setSelectedId: (id: number | null) => void
    tiposGastoData: TipoGasto[] | null
}

const SateliteActoresContext = createContext<
    SateliteActoresContextType | undefined
>(undefined)

export const SateliteActoresProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { empresaId: contextEmpresaId } = useSatelite()
    const empresaId = contextEmpresaId || '1'

    const [params, setParams] = useState<SateliteActoresContextType['params']>({
        obra_id: undefined,
        tipo: undefined,
        responsables: undefined,
        anio: undefined,
        fecha_reembolso: undefined,
        fecha_conclusion: undefined,
        concepto: undefined,
    })
    const [obrasOriginales, setObrasOriginales] = useState<Obra[] | null>(null)
    const [obrasFiltradas, setObrasFiltradas] = useState<Obra[] | null>(null)
    const [kpis, setKpis] = useState<KpisSatelite | null>(null)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const { data: obrasData, mutate: mutateObras } = useSWR(
        [
            `/all/obraporimpuesto`,
            empresaId,
        ],
        () =>
            getObrasPorImpuesto({
                id_empresa: parseInt(empresaId),
            }),
        { revalidateOnFocus: false }
    )

    const { data: tiposGastoData } = useSWR(
        [`/all/tipogasto`, empresaId],
        () =>
            apiClient
                .get('/all/tipogasto', {
                    params: { id_empresa: empresaId }
                })
                .then((res) => res.data.data),
        { revalidateOnFocus: false }
    )

    useEffect(() => {
        setObrasOriginales(obrasData || null)
    }, [obrasData])

    const applyFilters = (obras: Obra[]): Obra[] => {
        let filtered = [...obras].filter(
            (obra): obra is Obra => obra !== undefined
        )

        if (selectedId !== null && selectedId !== 0) {
            filtered = filtered.filter((obra) => obra.estado_id === selectedId)
        }

        if (params.obra_id) {
            filtered = filtered.filter((obra) => obra.id === params.obra_id)
        }

        if (params.tipo) {
            filtered = filtered.filter(
                (obra) => obra.tipo_id.toString() === params.tipo
            )
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

        if (params.responsables && params.responsables.length > 0) {
            filtered = filtered.filter((obra) => {
                if (!obra.responsable || !Array.isArray(obra.responsable))
                    return false
                return obra.responsable.some((resp) =>
                    params.responsables!.includes(resp.id.toString())
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
                const tipoGastoFecha = tipoGasto.created_at
                    ? dayjs(tipoGasto.created_at)
                    : null
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
    }, [
        tiposGastoData,
        params.fecha_conclusion,
        params.fecha_reembolso,
        obrasFiltradas
    ])

    const kpisIniciales = useMemo(() => {
        const validObrasFiltradas = obrasFiltradas
            ? obrasFiltradas.filter((obra): obra is Obra => obra !== undefined)
            : []

        return {
            totalObras: validObrasFiltradas.length,
            montoProyectos: validObrasFiltradas.reduce(
                (sum: number, obra: Obra) => {
                    const costo = Number(
                        obra.costo_proyecto
                            ?.toString()
                            .replace(/[^0-9.-]+/g, '') || 0
                    )
                    return sum + (isNaN(costo) ? 0 : costo)
                },
                0
            ),
            montoPagado: tiposGastoFiltrados
                ? tiposGastoFiltrados.reduce(
                      (sum: number, tipoGasto: any) =>
                          sum + (tipoGasto.monto_pagado || 0),
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
            responsables: undefined,
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
            responsable: nuevaObra.responsable || [],
            unidades_gestion: nuevaObra.unidades_gestion || [],
            centros_operacion: nuevaObra.centros_operacion || [],
            id_empresa: nuevaObra.id_empresa || parseInt(empresaId),
            posiciones: nuevaObra.posiciones || undefined,
            posicion_color: nuevaObra.posicion_color || undefined,
            monto_recuperado: nuevaObra.monto_recuperado || undefined
        }

        const nuevasObras = obrasData
            ? [...obrasData, normalizedObra].filter(
                  (obra): obra is Obra => obra !== undefined
              )
            : [normalizedObra]
        mutateObras(nuevasObras, false)

        setObrasOriginales(nuevasObras)

        const filteredObras = applyFilters(nuevasObras)
        setObrasFiltradas(filteredObras)
    }

    return (
        <SateliteActoresContext.Provider
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
        </SateliteActoresContext.Provider>
    )
}

export const useSateliteActores = (): SateliteActoresContextType => {
    const context = useContext(SateliteActoresContext)
    if (context === undefined) {
        throw new Error(
            'useSateliteActores debe usarse dentro de un SateliteActoresProvider'
        )
    }
    return context
}
