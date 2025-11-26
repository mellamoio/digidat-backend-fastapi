import { useBoolean } from '../../../hooks/useBoolean';
import { useDashboard } from '../hooks/useDashboard';
import { Header } from '../../../components/ui/layout/Container/Header';
import { Row } from '../../../components/ui/layout/Grid/Row';
import { Kpis } from '../../../components/ui/data-display/Kpis';
import { TableTodos } from '../../../components/Tables/TableTodos';
import FiltroVerticalDigidat from '../../../components/ui/data-display/Filtros/FiltroDigidat';
import { DashboardLayout, MainContent } from './index.styled';
import { ObrasProvider } from '../../../context/ObrasContext'

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
    <ObrasProvider>
      <div className="page-container">
        <Header />
        <DashboardLayout>
          <FiltroVerticalDigidat />
          <MainContent $fullscreen={fullScreen}>
            <Row>
              <Kpis />
            </Row>
            <Row style={{ marginTop: '24px' }}>
              <TableTodos />
            </Row>
          </MainContent>
        </DashboardLayout>
      </div>
    </ObrasProvider>
  );
};

export default Dashboard;