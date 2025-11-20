import styled from 'styled-components';

interface AnchorButtonProps {
  $isHovered: boolean;
}

export const AnchorButton = styled.a<AnchorButtonProps>`
  background-color: #722AE9;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  color: white;
  text-decoration: none;
  
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
  &:focus {
    outline: none;
  }

  .anticon {
    font-size: 16px;
    color: white;
  }

  &:hover {
    .anticon {
      color: white;
    }
  }
`;