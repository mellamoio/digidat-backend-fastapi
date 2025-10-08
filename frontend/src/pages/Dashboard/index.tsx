import { useBoolean } from '../../hooks/useBoolean';
import { useDashboard } from '../../hooks/useDashboard';
import { Header } from '../../components/Header';
import { Row } from '../../components/Row';
import { Kpis } from '../../components/Kpis';
import ProgressBar from '../../components/Progreso';
import { TableTodos } from '../../components/Tables/TableTodos';
import FiltroVerticalDigidat from '../../components/Filtros/FiltroVerticalSatelite';
import { DashboardLayout, MainContent } from './index.styled';
import { SateliteActoresProvider } from '../../context/ContextSateliteActores'

export const Dashboard: React.FC = () => {
  const { value: fullScreen } = useBoolean();
  const { state } = useDashboard();

  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard state:', {
      page: state.page,
      obraId: state.idObra,
    });
  }

  return (
    <div className="page-container">
      <Header />
      <DashboardLayout>
        <FiltroVerticalDigidat />
        <MainContent $fullscreen={fullScreen}>
          <Row>
            <Kpis />
          </Row>
          <Row style={{ marginTop: '24px' }}>
            <ProgressBar />
          </Row>
          <Row style={{ marginTop: '24px' }}>
          <SateliteActoresProvider>
            <TableTodos />
          </SateliteActoresProvider>
          </Row>
        </MainContent>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;