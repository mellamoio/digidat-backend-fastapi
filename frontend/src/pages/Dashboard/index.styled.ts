import { Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Sider, Header, Content } = Layout;

export const DashboardLayout = styled(Layout)`
  min-height: 100vh;
  background: #f5f7fa;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
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

  .ant-menu {
    border-right: none;
  }

  .ant-menu-item {
    margin: 4px 0;
    border-radius: 8px;
    padding-left: 24px !important;
    
    &:hover {
      color: #722AE9;
      background: rgba(114, 42, 233, 0.1);
    }

    &.ant-menu-item-selected {
      background: rgba(114, 42, 233, 0.1);
      color: #722AE9;
      font-weight: 500;
      
      &::after {
        border-right: 3px solid #722AE9;
      }
    }
  }
`;

export const MainHeader = styled(Header)`
  background: #fff !important;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1;
  position: sticky;
  top: 0;
`;

export const MainContent = styled(Content)`
  margin: 24px 16px 24px 266px; /* Ajustamos el margen izquierdo para la barra lateral */
  padding: 24px;
  min-height: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  width: calc(100% - 282px); /* Restamos el ancho de la barra lateral + márgenes */
  max-width: 100%;
  overflow-x: hidden;
  margin-top: 0;
  padding-top: 24px;
`;

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

export const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  h1 {
    color: #722AE9;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(90deg, #722AE9, #8c4dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const StatCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;