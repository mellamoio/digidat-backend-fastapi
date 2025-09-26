import { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../api/axiosConfig';

interface KPI {
  totalObras: number;
  montoProyectos: number;
}

export const useSateliteActores = () => {
  const [kpis, setKpis] = useState<any | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [obrasFiltradas, setObrasFiltradas] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch KPIs
        const kpisResponse = await api.get('/kpis');
        setKpis(kpisResponse.data.data);
        
        // Fetch obras
        const obrasResponse = await api.get('/obras');
        setObrasFiltradas(obrasResponse.data.data || []);
        
        // Get empresaId from user profile or local storage
        const profile = await api.get('/users/me');
        const userEmpresaId = profile.data.empresa_id || localStorage.getItem('empresa_id');
        setEmpresaId(userEmpresaId);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
        message.error('No se pudieron cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    kpis,
    empresaId,
    obrasFiltradas,
    selectedId,
    setSelectedId,
    loading,
    error
  };
};

export default useSateliteActores;
