import { Layout } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;

export const DetallesLayout = styled(Layout)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 20px;
  gap: 20px;
  width: 100%;
`;

export const DetallesContainer = styled(Content)`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 1920px) {
    padding: 1.5rem;
  }

  @media (max-width: 1600px) {
    padding: 1.25rem;
  }

  @media (max-width: 1200px) {
    padding: 1.25rem;
  }

  @media (max-width: 992px) {
    padding: 1rem;
  }

  @media (max-width: 768px) {
    margin: 0.75rem;
    padding: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 576px) {
    margin: 0.5rem;
    padding: 0.75rem;
  }
`;


export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

export const IconButton = styled.button`
  background: #C4C4C4;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: #A0A0A0;
  }
`;

export const Menu = styled.div`
  display: flex;
  padding: 12px 0 0 16px;
  gap: 2px;
  margin-bottom: 0;
`;

export const MenuItem = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#FFFFFF" : "#E2E2E2")};
  color: ${({ active }) => (active ? "#722AE9" : "#A0A0A0")};
  padding: 12px 16px;
  border: ${({ active }) => (active ? "1px solid #D1D1D1" : "none")};
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${({ active }) => (active ? "#FFFFFF" : "#D0D0D0")};
  }
`;

export const ContentPlaceholder = styled.div`
  min-height: 200px;
  padding: 20px;
  border-radius: 0 4px 4px 4px;
  border: 1px solid #d1d1d1;
  background: white;
`;

export const SeccionHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  background: #f5f5f5;
  
  &:hover {
    background: #ebebeb;
  }
`;

export const IconoFlecha = styled.span<{ abierto: boolean }>`
  display: inline-flex;
  align-items: center;
  color: #868686;
  font-size: 12px;
  transform: ${({ abierto }) => (abierto ? "rotate(90deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease-in-out;
`;

export const SeccionContent = styled.div`
  padding: 15px 0;
  margin-top: 5px;
  
  .rdt_Pagination {
    display: none !important;
  }
`;

export const ProgressBarContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;