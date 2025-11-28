import { useState, useEffect } from 'react';

export const useSateliteActores = () => {
  const [obrasFiltradas, setObrasFiltradas] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setObrasFiltradas([]);
  }, []);

  return {
    loading,
    error,
    obrasFiltradas,
    selectedId,
    setSelectedId,
  };
};

export default useSateliteActores;