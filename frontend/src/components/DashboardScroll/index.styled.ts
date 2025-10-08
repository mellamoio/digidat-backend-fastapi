import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  gap: 8px;
  padding: 8px 0;
`;

export const ContainerScroll = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 8px 0;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex: 0 0 auto;
  }
`;

export const ButtonScroll = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  position: relative;
  color: #666;
  flex-shrink: 0;
  opacity: ${props => props.disabled ? 0.3 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: opacity 0.2s;

  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-top: 2px solid currentColor;
    border-left: 2px solid currentColor;
    transition: all 0.2s;
  }

  &.left::before {
    transform: rotate(-45deg);
    margin-right: 2px;
  }

  &.right::before {
    transform: rotate(135deg);
    margin-left: 2px;
  }

  &:hover:not(:disabled) {
    color: #722AE9;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    
    &::before {
      width: 8px;
      height: 8px;
    }
  }
`;