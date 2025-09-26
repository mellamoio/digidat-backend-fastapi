import { useState, useEffect } from 'react';
import { useSateliteActores } from '../../../hooks/useUsuarios';
import type { DashboardState } from '../types/dashboard.types';

export const useDashboard = () => {
  const { kpis, obrasFiltradas } = useSateliteActores();
  const [state, setState] = useState<DashboardState>({
    page: 'index',
    idObra: 0,
  });

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/dashboard/detalles/')) {
      const match = pathname.match(/\/dashboard\/detalles\/(\d+)/);
      if (match && match[1]) {
        setState(prev => ({
          ...prev,
          page: 'detalles',
          idObra: parseInt(match[1], 10)
        }));
        return;
      }
    }

    const windowPage = typeof window !== 'undefined' && window.page ? window.page : 'index';
    const windowIdObra = 
      typeof window !== 'undefined' &&
      typeof window.id_obra === 'number' &&
      !isNaN(window.id_obra)
        ? window.id_obra
        : 0;

    setState({
      page: windowPage,
      idObra: windowIdObra
    });
  }, []);

  return {
    state,
    setState,
    kpis,
    obrasFiltradas: obrasFiltradas || []
  };
};
