import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const NuevoRequisitoButton = styled.button`
  background: #722AE9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  float: right;
  margin-bottom: 10px;

  &:hover {
    background: #722AE9;
  }
`;

export const Thead = styled.thead`
  background: #f8f9fa;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #ddd;
`;

export const Th = styled.th`
  padding: 10px;
  text-align: left;
  font-weight: bold;
`;

export const Tbody = styled.tbody`
  tr:hover {
    background: #f1f1f1;
  }
`;

export const Td = styled.td`
  padding: 10px;
  text-align: left;
`;

export const Container = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  color: #722AE9;
  padding: 8px 12px;
  border: 1px solid #722AE9;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  margin-left: auto;
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  overflow: visible;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 400px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: transparent;
  color: #868686;
  cursor: pointer;
  height: 100%;
`;

export const TableHeader = styled.th`
  padding: 10px;
  background-color: #f4f4f4;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: left;

  &:nth-child(1) {
    width: 146px;
  }
  &:nth-child(2) {
    width: 250px;
  }
  &:nth-child(3) {
    width: 270px;
  }
  &:nth-child(4) {
    width: 160px;
    text-align: center;
  }
  &:nth-child(5) {
    width: 120px;
    text-align: center;
  }
  &:nth-child(6) {
    width: 120px;
    text-align: center;
  }
`;

export const DocumentosContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const CategoriaBadge = styled.span`
  padding: 2px 5px;
  background: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
`;

export const DocumentoBadge = styled(IconWrapper)`
  background-color: #4caf50;
  width: 24px;
  height: 24px;
  border-radius: 3px;
`;

export const BadgeText = styled.span`
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 100%;
`;

export const ResponsablesContainer = styled.div`
  display: flex;
  gap: 5px;
`;

export const ResponsableIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  border-radius: 50%;
  font-size: 12px;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const ProgressBarStyled = styled.div<{ $progress: number }>`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease-in-out;
  }
`;