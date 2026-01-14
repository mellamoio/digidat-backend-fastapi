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
  margin-bottom: 20px;
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