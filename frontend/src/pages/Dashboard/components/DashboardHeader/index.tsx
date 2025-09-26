import React from 'react';
import { Header } from '../../../../components/Header';

export const DashboardHeader: React.FC = () => {
  return (
    <Header 
      title="Panel de Control"
      showSettings={true}
    />
  );
};

export default DashboardHeader;
