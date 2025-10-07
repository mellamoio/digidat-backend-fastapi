import { Layout } from 'antd';
import styled from 'styled-components';
const { Sider  } = Layout;

export const DashboardLayout = styled(Layout)`
  min-height: 100vh;
  background: #f5f7fa;
  max-width: 100%;
  display: flex;
  padding: 20px;
  flex-direction: row;
  overflow: hidden;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 30px 40px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  width: 100%;
`;

export const Sidebar = styled(Sider)`
  background: #fff !important;
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.05);
  z-index: 10;
  position: fixed !important;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  
  .ant-layout-sider-trigger {
    background: #f5f7fa;
    color: #722AE9;
  }
`;