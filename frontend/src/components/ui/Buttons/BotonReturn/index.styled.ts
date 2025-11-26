import styled from "styled-components";

export const ReturnButton = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: #722AE9;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  padding-bottom: 4px;

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #722AE9;
    bottom: 0;
    left: 0;
  }

  svg {
    margin-right: 8px;
    font-size: 14px;
  }
`;
