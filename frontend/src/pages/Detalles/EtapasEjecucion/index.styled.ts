import styled from "styled-components";

export const DetallesContainer = styled.div`
  padding: 20px;
  background: white;
  width: 100%;
  height: 100vh;
  overflow: auto;
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

export const BarraProgresoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BarraProgresoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BarraProgreso = styled.div`
  flex: 1;
  height: 8px;
  background: #e2e2e2;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0px 1px 4px #00000040;
`;

export const Progreso = styled.div<{ porcentaje: number }>`
  width: ${({ porcentaje }) => porcentaje}%;
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease-in-out;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #722AE9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    stroke: currentColor;
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const IconButton = styled.button`
  background: #e2e2e2;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &:hover {
    background: #d0d0d0;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #868686;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #722AE9;
`;

export const Menu = styled.div`
  display: flex;
  padding: 12px 16px;
  gap: 2px;
  margin-bottom: 16px;
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
`;

export const ContentPlaceholder = styled.div`
  min-height: 200px;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #d1d1d1;
  overflow-x: auto;
`;

export const SeccionContainer = styled.div`
  position: relative;
`;

export const SeccionHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
`;

export const IconoFlecha = styled.span<{ abierto: boolean }>`
  display: inline-block;
  margin-right: 8px;
  color: #868686;
  font-size: 8px;
  transform: ${({ abierto }) => (abierto ? "rotate(90deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease-in-out;
`;

export const SeccionContent = styled.div`
  padding: 10px;
  margin-top: 5px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: transparent;
  color: #c4c4c4;
  width: 30px;
  height: 30px;
  background-color: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 2px;
  cursor: pointer;
`;

export const CustomSelect = styled.div<{ backgroundColor: string; color: string }>`
  .ant-select {
    width: 100%;
  }
  .ant-select-selector {
    background-color: ${(props) => props.backgroundColor} !important;
    color: ${(props) => props.color} !important;
    border-radius: 4px !important;
    border: 1px solid #d9d9d9 !important;
  }
  .ant-select-arrow {
    color: ${(props) => props.color} !important;
  }
`;