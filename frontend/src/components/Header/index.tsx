import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIdentifiers } from "../../constants/menu";
import { getInfoMenu } from "../../helpers/getInfoMenu";
import { SettingsButton } from "../Buttons/SettingsButton";
import { UserOutlined, LogoutOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { authService } from '../../api/authService';
import { message } from 'antd';
import {
  HeaderContainer,
  HeaderContent,
  Title,
  ActionsContainer,
  RegisterButton,
  SettingsButtonWrapper,
  SettingsIconWrapper,
  UserMenuContainer,
  UserButton,
  UserMenuDropdown,
  MenuItem,
  Divider
} from './index.styled';

interface HeaderProps {
  showSettings?: boolean;
  onSettingsClick?: () => void;
  showMenu?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserButtonHovered, setIsUserButtonHovered] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleRegisterClick = () => {
    // TODO: Implement register functionality
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      message.success('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error with the API, we'll still clear the token and redirect
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>{title || (getInfoMenu(MenuIdentifiers.DIGIDAT)?.nombre_plural ?? "Obra por Impuestos")}</Title>
        
        <ActionsContainer>
          <RegisterButton
            onClick={handleRegisterClick}
            $isHovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Registrar Obra por Impuesto
          </RegisterButton>
          
          <SettingsButtonWrapper
            $isHovered={isSettingsHovered}
            onMouseEnter={() => setIsSettingsHovered(true)}
            onMouseLeave={() => setIsSettingsHovered(false)}
          >
            <SettingsIconWrapper>
              <SettingsButton path="digidat/ajustes" />
            </SettingsIconWrapper>
          </SettingsButtonWrapper>

          <UserMenuContainer ref={userMenuRef}>
            <UserButton
              onClick={toggleUserMenu}
              $isHovered={isUserButtonHovered}
              onMouseEnter={() => setIsUserButtonHovered(true)}
              onMouseLeave={() => setIsUserButtonHovered(false)}
            >
              <UserOutlined style={{ fontSize: '20px', color: '#2d3748' }} />
            </UserButton>
            
            <UserMenuDropdown $isOpen={isUserMenuOpen}>
              <MenuItem>
                <UserSwitchOutlined />
                <span>Mi Perfil</span>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutOutlined style={{ color: '#ff4d4f' }} />
                <span style={{ color: '#ff4d4f' }}>Cerrar Sesión</span>
              </MenuItem>
            </UserMenuDropdown>
          </UserMenuContainer>
        </ActionsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;