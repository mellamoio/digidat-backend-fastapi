import styled from 'styled-components';

export const DashboardContentContainer = styled.div`
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 80px);
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const KPIContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const ProgressContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;
