import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0;
  height: 64px;
  display: flex;
  align-items: center;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 10;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 0 24px;
  box-sizing: border-box;
  margin: 0;
`;

export const Title = styled.h1`
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ActionsContainer = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-left: auto;
  padding-right: 8px;
`;


export const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const UserButton = styled.button<{ $isHovered: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  background-color: ${props => props.$isHovered ? '#f0f2f5' : 'transparent'};
  
  &:hover {
    background-color: #f0f2f5;
  }
`;

export const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  overflow: hidden;
`;

export const MenuItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2d3748;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  svg {
    font-size: 16px;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
`;
