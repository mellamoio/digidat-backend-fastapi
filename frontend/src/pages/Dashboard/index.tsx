import React from 'react';
import { useBoolean } from '../../hooks/useBoolean';
import { ContainerStyled } from '../../components/Containers/Container.styled';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardContent } from './components/DashboardContent';
import { useDashboard } from './hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const { value: fullScreen } = useBoolean();
  const { state } = useDashboard();

  console.log('Current page:', state.page);
  console.log('Current obra ID:', state.idObra);

  return (
    <ContainerStyled $fullscreen={fullScreen}>
      <DashboardHeader />
      <DashboardContent />
    </ContainerStyled>
  );
};

export default Dashboard;