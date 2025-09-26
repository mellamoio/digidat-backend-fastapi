import styled, { css } from 'styled-components';
import { Menu } from 'antd';

export const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 24px 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  color: #2d3748;
  background: linear-gradient(90deg, #722AE9, #8c4dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const ActionsContainer = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-left: auto;
  padding-right: 8px;
`;

export const RegisterButton = styled.button<{ $isHovered: boolean }>`
  background-color: ${props => props.$isHovered ? '#5f21b9' : '#722AE9'};
  border: 1px solid #5f21b9;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  white-space: nowrap;

  &:hover {
    background-color: #5f21b9;
  }
`;

export const SettingsButtonWrapper = styled.div<{ $isHovered: boolean }>`
  background-color: ${props => props.$isHovered ? '#5f21b9' : '#722AE9'};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #5f21b9;
  transition: all 0.2s ease;
`;

export const SettingsIconWrapper = styled.div`
  transform: scale(1.2);
  display: flex;
  align-items: center;
  justify-content: center;
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
