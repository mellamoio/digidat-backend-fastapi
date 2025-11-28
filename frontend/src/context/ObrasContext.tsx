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
    responsables?: string[]
    centros_operacion?: string[]
    tipo?: string
    anio?: string
    obra_id?: number
    fecha_inicio?: string
    fecha_fin?: string
    concepto?: string
  }
  setParams: (newParams: Partial<ObrasContextType['params']>) => void
  resetFilters: () => void
  setObrasFiltradas: React.Dispatch<React.SetStateAction<Obra[] | null>>
  agregarObra: (nuevaObra: Obra) => void
  selectedId: number | null
  setSelectedId: (id: number | null) => void
  tiposGastoData: TipoGasto[] | null
  mutateObras: () => void
}

const ObrasContext = createContext<ObrasContextType | undefined>(undefined)

export const ObrasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { empresaId: contextEmpresaId } = useSatelite()
  const empresaId = contextEmpresaId || '1'

  const [params, setParams] = useState<ObrasContextType['params']>({
    obra_id: undefined,
    tipo: undefined,
    responsables: undefined,
    centros_operacion: undefined,
    fecha_inicio: undefined,
    fecha_fin: undefined,
    concepto: undefined,
  })

  const [obrasOriginales, setObrasOriginales] = useState<Obra[] | null>(null)
  const [obrasFiltradas, setObrasFiltradas] = useState<Obra[] | null>(null)
  const [kpis, setKpis] = useState<KpisObras | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: obrasData, mutate: mutateObras } = useSWR(
    [`v1/obras/`, empresaId],
    () => apiClient.get('/v1/obras/', { params: { id_empresa: empresaId } }).then(res => res.data),
    { revalidateOnFocus: false }
  )

  const { data: tiposGastoData } = useSWR(
    [`/all/tipogasto`, empresaId],
    () => apiClient.get('/all/tipogasto', { params: { id_empresa: empresaId } }).then(res => res.data),
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    if (obrasData && Array.isArray(obrasData)) {
      setObrasOriginales(obrasData)
    }
  }, [obrasData])

  const applyFilters = (obras: Obra[]): Obra[] => {
    let filtered = [...obras].filter((obra): obra is Obra => obra !== undefined)

    if (selectedId !== null && selectedId !== 0) {
      filtered = filtered.filter((obra) => obra.estado_id === selectedId)
    }

    if (params.obra_id) {
      filtered = filtered.filter((obra) => obra.id_obra === params.obra_id)
    }

    if (params.tipo) {
      filtered = filtered.filter((obra) => obra.tipo_id.toString() === params.tipo)
    }

    if (params.fecha_inicio || params.fecha_fin) {
      filtered = filtered.filter((obra) => {
        if (!obra.fecha_inicio) return false
        return filterDateRange(
          obra.fecha_inicio,
          obra.fecha_fin,
          params.fecha_inicio,
          params.fecha_fin
        )
      })
    }

    if (params.responsables && params.responsables.length > 0) {
      filtered = filtered.filter((obra) =>
        obra.responsable && params.responsables!.includes(obra.responsable.id_responsable.toString())
      )
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
    if (!obrasData || !Array.isArray(obrasData)) {
      setObrasFiltradas([])
      return
    }

    const filteredObras = applyFilters(obrasData)
    setObrasFiltradas(filteredObras)
  }, [obrasData, params, selectedId])

  const tiposGastoFiltrados = useMemo(() => {
    if (!tiposGastoData || !obrasFiltradas) return null
    
    let filtered = [...tiposGastoData]
    const obraIds = obrasFiltradas.map((obra) => obra.id_obra)
    
    filtered = filtered.filter(
      (tipoGasto: TipoGasto & { id_obra?: number }) =>
        obraIds.includes(tipoGasto.id_obra!)
    )
    
    if (params.fecha_fin && params.fecha_inicio) {
      filtered = filtered.filter((tipoGasto: TipoGasto) => {
        const tipoGastoFecha = tipoGasto.created_at ? dayjs(tipoGasto.created_at) : null
        if (!tipoGastoFecha) return false
        
        const fechaInicio = dayjs(params.fecha_inicio)
        const fechaFin = dayjs(params.fecha_fin)
        
        return (
          tipoGastoFecha.isAfter(fechaInicio, 'day') &&
          tipoGastoFecha.isBefore(fechaFin, 'day')
        )
      })
    }
    
    return filtered
  }, [tiposGastoData, params.fecha_fin, params.fecha_inicio, obrasFiltradas])

  const kpisIniciales = useMemo(() => {
    const validObrasFiltradas = obrasFiltradas
      ? obrasFiltradas.filter((obra): obra is Obra => obra !== undefined)
      : []

    return {
      totalObras: validObrasFiltradas.length,
      montoProyectos: validObrasFiltradas.reduce((sum: number, obra: Obra) => {
        const costo = Number(obra.costo_proyecto ?? 0)
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
  }, [obrasFiltradas, tiposGastoFiltrados])

  useEffect(() => {
    setKpis(kpisIniciales)
  }, [kpisIniciales])

  const resetFilters = () => {
    setParams({
      responsables: undefined,
      centros_operacion: undefined,
      tipo: undefined,
      anio: undefined,
      obra_id: undefined,
      fecha_inicio: undefined,
      fecha_fin: undefined,
      concepto: undefined,
    })
    setSelectedId(null)
  }

  const agregarObra = (nuevaObra: Obra) => {
    if (!nuevaObra) return

    const normalizedObra: Obra = { ...nuevaObra }
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
        tiposGastoData,
        mutateObras
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