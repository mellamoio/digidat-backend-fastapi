import styled from "styled-components";

export const FiltroContainer = styled.div<{ isCollapsed: boolean }>`
  position: relative;
  width: ${(props) => (props.isCollapsed ? "40px" : "200px")};
  padding: ${(props) => (props.isCollapsed ? "12px 0" : "12px")};
  background: white;
  border-radius: 4px;
  border: 1px solid #C4C4C4;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto;
  min-height: 200px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: ${(props) => (props.isCollapsed ? "40px" : "100%")};
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  padding: 8px;
  z-index: 1;
`;

export const Column = styled.div<{ isCollapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  visibility: ${(props) => (props.isCollapsed ? "hidden" : "visible")};
  opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;