import { Layout } from 'antd';
import styled from 'styled-components';

const { Content, Sider } = Layout;

export const DashboardLayout = styled(Layout)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 20px;
  gap: 20px;
  width: 100%;
`;

export const MainContent = styled(Content)<{ $fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: ${({ $fullscreen }) => ($fullscreen ? '20px' : '0')};
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: width 0.3s ease, padding 0.3s ease, margin 0.3s ease;

  max-width: ${({ $fullscreen }) => ($fullscreen ? '100%' : 'min(95vw, 1920px)')};
  min-width: ${({ $fullscreen }) => ($fullscreen ? '100%' : '300px')};

  overflow-x: ${({ $fullscreen }) => ($fullscreen ? 'hidden' : 'auto')};
  overflow-y: ${({ $fullscreen }) => ($fullscreen ? 'auto' : 'visible')};

  @media (max-width: 1920px) {
    max-width: min(95vw, 1920px);
    padding: 1.5rem;
  }

  @media (max-width: 1600px) {
    max-width: min(97vw, 1600px);
    padding: 1.25rem;
  }

  @media (max-width: 1200px) {
    max-width: min(98vw, 1200px);
    padding: 1.25rem;
  }

  @media (max-width: 992px) {
    max-width: min(99vw, 992px);
    padding: 1rem;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0.75rem;
    padding: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
    margin: 0.5rem;
    padding: 0.75rem;
  }

  ${({ $fullscreen }) =>
    $fullscreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    z-index: 1000;
    border-radius: 0;
    margin: 0;
    max-width: 100%;
    min-width: 100%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    overflow-x: hidden;
  `}

  @media (orientation: portrait) and not ${({ $fullscreen }) => $fullscreen && 'all'} {
    border-radius: 8px;
    margin: 1rem auto;
    max-width: min(98vw, 1200px);
  }
`;

export const Sidebar = styled(Sider)`
  background: #fff !important;
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