import styled from "styled-components";

interface IconButtonProps {
  $fullscreen?: boolean;
}

export const ContainerStyled = styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  ${({ $fullscreen }) =>
    $fullscreen &&
    `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    `}
`;

interface ContainerItemProps {
  $gridArea?: string;
  $fullscreen?: boolean;
}

export const ContainerItem = styled.div<ContainerItemProps>`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 615px;
  ${({ $gridArea, $fullscreen }) =>
    !$fullscreen && $gridArea ? `grid-area: ${$gridArea};` : ""}
`;

export const IconButton = styled.button<IconButtonProps>`
  background-color: ${({ $fullscreen }) => ($fullscreen ? "#f5f5f5" : "#fff")};
  display: flex;
  border: none;
  border-radius: 5px;
  color: ${({ $fullscreen }) => ($fullscreen ? "#000" : "#000")};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #f5f5f5;
  }
  & > i {
    font-size: ${({ $fullscreen }) => ($fullscreen ? "2rem" : "4rem")};
    transition: font-size 0.3s;
  }
`;

export const ContainerBlock = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ContainerDiv = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  & > p {
    margin: 0;
  }
`;

export const SectionStyled = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;