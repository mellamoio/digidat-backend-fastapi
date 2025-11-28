import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getUsers } from "../services/getUser.service";
import type { User } from "../types/user";
import type { Obra } from "../types/obra";
import { message } from "antd";

interface DigidatContextType {
  usuarios: User[];
  fetchUsuarios: () => Promise<void>;
  empresaId: string | null;
  setEmpresaId: (empresaId: string | null) => void;
  filteredObras: Obra[];
  setFilteredObras: (obras: Obra[]) => void;
}

export const DigidatContext = createContext<DigidatContextType | undefined>(undefined);

export const SateliteProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchUsuariosData();
  }, []);

  return (
    <DigidatContext.Provider
      value={{
        usuarios,
        fetchUsuarios: fetchUsuariosData,
        empresaId,
        setEmpresaId,
        filteredObras,
        setFilteredObras,
      }}
    >
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