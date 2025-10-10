import { Button } from 'antd';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  && {
    background-color: #722AE9;
    color: white;
    height: 34px;
    border: none;
    outline: none;
    box-shadow: none;
    transition: all 0.1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover, &:focus {
      background-color: #722AE9;
      color: white;
      opacity: 0.95;
    }
    
    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }
    
    &:focus {
      outline: none;
      box-shadow: none;
    }
    
    &[disabled] {
      background-color: #d3d3d3;
      color: #666;
    }
  }
`;
