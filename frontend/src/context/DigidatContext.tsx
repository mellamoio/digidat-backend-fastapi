import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import useSWR from "swr";
import { getUsers } from "../services/getUser.service";
import { getObra } from "../services/getObra.service";
import { fetchTiposGasto } from "../services/getPagos.service";
import type { User } from "../types/user";
import type { Obra } from "../types/obra";
import { message } from "antd";
import { filterDateRange } from "../helpers/filterDateRange";

interface TipoGasto {
  id: number;
  nombre: string;
}

interface DigidatContextType {
  usuarios: User[];
  fetchUsuarios: () => Promise<void>;
  filteredObras: Obra[];
  setFilteredObras: (obras: Obra[]) => void;
  tiposGastoData: TipoGasto[] | null;
  obras: Obra[] | null;
  obrasOriginales: Obra[] | null;
  obrasFiltradas: Obra[] | null;
  params: {
    user?: string[];
    tipo?: string;
    year?: string;
    obra_id?: number;
    fecha_reembolso?: string;
    fecha_conclusion?: string;
    concepto?: string;
  };
  setParams: (newParams: Partial<DigidatContextType['params']>) => void;
  resetFilters: () => void;
  setObrasFiltradas: React.Dispatch<React.SetStateAction<Obra[] | null>>;
  agregarObra: (nuevaObra: Obra) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

export const DigidatContext = createContext<DigidatContextType | undefined>(undefined);

export const SateliteProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [obrasOriginales, setObrasOriginales] = useState<Obra[] | null>(null);
  const [obrasFiltradas, setObrasFiltradas] = useState<Obra[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tiposGastoData, setTiposGastoData] = useState<TipoGasto[] | null>(null);
  const [params, setParams] = useState<DigidatContextType['params']>({
    obra_id: undefined,
    tipo: undefined,
    user: undefined,
    year: undefined,
    fecha_reembolso: undefined,
    fecha_conclusion: undefined,
    concepto: undefined,
  });

  const fetchUsuariosData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await getUsers();
      if (Array.isArray(response)) {
        setUsuarios(response);
      } else {
        console.warn("La respuesta no es un array:", response);
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      message.error("No se pudieron cargar los usuarios.");
      setUsuarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTiposGasto = async () => {
      try {
        const tipos = await fetchTiposGasto();
        setTiposGastoData(tipos);
      } catch (error) {
        console.error("[DigidatContext] Error al cargar tipos de gasto:", error);
        setTiposGastoData([
          { id: 1, nombre: "Administrativo" },
          { id: 2, nombre: "Reembolsable" },
        ]);
      }
    };
    loadTiposGasto();
  }, []);

  const { data: obrasData, mutate: mutateObras } = useSWR(
    '/obras',
    () => getObra(),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    fetchUsuariosData();
  }, []);

  useEffect(() => {
    setObrasOriginales(obrasData || null);
  }, [obrasData]);

  const applyFilters = (obras: Obra[]): Obra[] => {
    let filtered = [...obras].filter(
      (obra): obra is Obra => obra !== undefined
    );

    if (selectedId !== null && selectedId !== 0) {
      filtered = filtered.filter((obra) => obra.estado_id === selectedId);
    }

    if (params.obra_id) {
      filtered = filtered.filter((obra) => obra.id_obra === params.obra_id);
    }

    if (params.tipo) {
      filtered = filtered.filter(
        (obra) => obra.tipo_id.toString() === params.tipo
      );
    }

    if (params.year || params.fecha_conclusion || params.fecha_reembolso) {
      filtered = filtered.filter((obra) => {
        if (!obra.fecha_inicio) return false;
        return filterDateRange(
          obra.fecha_inicio,
          obra.fecha_fin,
          params.fecha_reembolso,
          params.fecha_conclusion
        );
      });
    }

    if (params.user && params.user.length > 0) {
      filtered = filtered.filter((obra) => {
        if (!obra.responsable || !Array.isArray(obra.responsable))
          return false;
        return obra.responsable.some((resp) =>
          params.user!.includes(resp.id.toString())
        );
      });
    }

    return filtered;
  };

  useEffect(() => {
    if (!obrasData) {
      setObrasFiltradas([]);
      return;
    }

    const filteredObras = applyFilters(obrasData);
    setObrasFiltradas(filteredObras);
  }, [obrasData, params, selectedId]);

  const resetFilters = () => {
    setParams({
      user: undefined,
      tipo: undefined,
      year: undefined,
      obra_id: undefined,
      fecha_reembolso: undefined,
      fecha_conclusion: undefined,
      concepto: undefined,
    });
    setSelectedId(null);
  };

  const agregarObra = (nuevaObra: Obra) => {
    if (!nuevaObra) {
      console.error('nuevaObra es null o undefined');
      return;
    }

    const Obra: Obra = {
      id_obra: nuevaObra.id_obra || 0,
      nombre: nuevaObra.nombre || 'Sin nombre',
      tipo_id: nuevaObra.tipo_id || 0,
      estado_id: nuevaObra.estado_id || 0,
      costo_proyecto: nuevaObra.costo_proyecto || 0,
      fecha_inicio: nuevaObra.fecha_inicio || 'Sin fecha',
      fecha_fin: nuevaObra.fecha_fin || 'Sin fecha',
      responsable: nuevaObra.responsable || undefined,
      centros_operacion: nuevaObra.centros_operacion || [],
      monto_recuperado: nuevaObra.monto_recuperado || undefined
    };

    const nuevasObras = obrasData
      ? [...obrasData, Obra].filter(
          (obra): obra is Obra => obra !== undefined
        )
      : [Obra];
    mutateObras(nuevasObras, false);

    setObrasOriginales(nuevasObras);

    const filteredObras = applyFilters(nuevasObras);
    setObrasFiltradas(filteredObras);
  };

  const contextValue = useMemo(
    () => ({
      usuarios,
      fetchUsuarios: fetchUsuariosData,
      filteredObras,
      setFilteredObras,
      tiposGastoData,
      obras: obrasData || null,
      obrasOriginales,
      obrasFiltradas,
      params,
      setParams,
      resetFilters,
      setObrasFiltradas,
      agregarObra,
      selectedId,
      setSelectedId,
    }),
    [usuarios, filteredObras, tiposGastoData, obrasData, obrasOriginales, obrasFiltradas, params, selectedId]
  );

  return (
    <DigidatContext.Provider value={contextValue}>
      {children}
    </DigidatContext.Provider>
  );
};

export const useSatelite = () => {
  const context = useContext(DigidatContext);
  if (context === undefined) {
    throw new Error("useSatelite debe usarse dentro de un SateliteProvider");
  }
  return context;
};