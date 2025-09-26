import React from 'react';
import { Row } from '../../../../components/Row';
import { Column } from '../../../../components/Column';
import { DashboardTodos } from '../../../../components/Kpis';
import ProgressBar from '../../../../components/Progreso';
import { DashboardContentContainer } from './DashboardContent.styled';

export const DashboardContent: React.FC = () => {
  return (
    <DashboardContentContainer>
      <Row>
        <Column>
          <DashboardTodos />
        </Column>
      </Row>
      
      <Row>
        <Column>
          <ProgressBar />
        </Column>
      </Row>
    </DashboardContentContainer>
  );
};

export default DashboardContent;
