import styled from "styled-components";

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
