import styled from "styled-components";
import { Button } from "antd";

export const FiltroVerticalContainer = styled.div<{ isCollapsed: boolean }>`
  position: relative;
  padding: 16px;
  background: rgb(255, 255, 255);
  border-radius: 8px;
  max-width: 305px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 16px;
`;

export const Column = styled.div<{ gap?: number; isCollapsed?: boolean }>`
  display: ${({ isCollapsed }) => (isCollapsed ? "none" : "flex")};
  flex-direction: column;
  gap: ${({ gap }) => gap || 12}px;
  width: 100%;
`;

export const FilterButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

export const StyledButton = styled(Button)<{ selected?: boolean }>`
  background-color: ${(props) => (props.selected ? "#868686" : "inherit")};
  color: ${(props) => (props.selected ? "white" : "black")};
`;