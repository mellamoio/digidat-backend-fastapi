import type { Obra } from '../../../types/obra';

export interface DashboardState {
  page: string;
  idObra: number;
}

export interface DashboardContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}

export interface KPI {
  totalObras: number;
}

export interface DashboardProps {
  fullScreen?: boolean;
}
