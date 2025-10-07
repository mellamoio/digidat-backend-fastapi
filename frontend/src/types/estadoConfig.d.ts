import type { ReactNode } from 'react';

export interface EstadoConfig {
  id: number;
  bgColor: string;
  textColor: string;
  selectedColor: string;
  numberColor: string;
  icon?: ReactNode;
  label: string;
  getNumber: (totalObras: number, obrasPorEstado: Record<number, number>) => number;
}

export type EstadoData = Omit<EstadoConfig, 'getNumber'> & {
  getNumber: (total: number, obras: Record<number, number>) => number;
};
