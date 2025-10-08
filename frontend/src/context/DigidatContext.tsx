// src/satelite/contexts/SateliteContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getResponsables } from "../services/getResponsables.service";
import type { Obra } from "../types/obra";
import { message } from "antd";

interface SateliteContextType {
  responsables: { id: string; nombres: string }[];
  fetchResponsables: () => Promise<void>;
  empresaId: string | null;
  setEmpresaId: (empresaId: string | null) => void;
  filteredObras: Obra[];
  setFilteredObras: (obras: Obra[]) => void;
}

const SateliteContext = createContext<SateliteContextType | undefined>(undefined);

export const SateliteProvider = ({ children }: { children: ReactNode }) => {
  const [responsables, setResponsables] = useState<{ id: string; nombres: string }[]>([]);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResponsablesData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await getResponsables();
      if (Array.isArray(response)) {
        setResponsables(response);
      } else {
        console.warn("La respuesta no es un array:", response);
        setResponsables([]);
      }
    } catch (error) {
      console.error("Error al cargar responsables:", error);
      message.error("No se pudieron cargar los responsables.");
      setResponsables([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsablesData();
  }, []);

  return (
    <SateliteContext.Provider
      value={{
        responsables,
        fetchResponsables: fetchResponsablesData,
        empresaId,
        setEmpresaId,
        filteredObras,
        setFilteredObras,
      }}
    >
      {children}
    </SateliteContext.Provider>
  );
};

export const useSatelite = () => {
  const context = useContext(SateliteContext);
  if (context === undefined) {
    throw new Error("useSatelite debe usarse dentro de un SateliteProvider");
  }
  return context;
};