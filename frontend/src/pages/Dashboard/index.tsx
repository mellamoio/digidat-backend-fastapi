import React from 'react';
import { useBoolean } from '../../hooks/useBoolean';
import { ContainerStyled } from '../../components/Containers/Container.styled';
import { Header } from '../../components/Header';
import { useDashboard } from '../../hooks/useDashboard';
import { Row } from '../../components/Row';
import { Column } from '../../components/Column';
import { DashboardTodos } from '../../components/Kpis';
import ProgressBar from '../../components/Progreso';
import { TableTodos } from '../../components/Tables/TableTodos';
import { PageContainer, ContentWrapper } from './index.styled';

export const Dashboard: React.FC = () => {
  const { value: fullScreen } = useBoolean();
  const { state } = useDashboard();

  console.log('Current page:', state.page);
  console.log('Current obra ID:', state.idObra);

  return (
    <PageContainer>
      <Header />
      <ContentWrapper>
        <ContainerStyled $fullscreen={fullScreen}>
          <Row>
            <Column>
              <DashboardTodos />
            </Column>
          </Row>
          
          <Row style={{ marginTop: '24px' }}>
            <Column>
              <ProgressBar />
            </Column>
          </Row>

          <Row style={{ marginTop: '24px' }}>
            <Column>
                <TableTodos />
            </Column>
          </Row>
        </ContainerStyled>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Dashboard;