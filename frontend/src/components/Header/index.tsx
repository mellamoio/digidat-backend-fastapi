import { useNavigate } from 'react-router-dom';
import { SettingsButton } from "../Buttons/SettingsButton";
import { ButtonPrimary } from "../Buttons/Primary";
import { UserButton } from "../Buttons/UserButton";
import { useUserMenu } from '../../hooks/useUserMenu';
import { UserSwitchOutlined, LogoutOutlined } from '@ant-design/icons';
import {
  HeaderContainer,
  HeaderContent,
  Title,
  ActionsContainer,
  UserMenuContainer,
  UserMenuDropdown,
  MenuItem,
  Divider
} from './index.styled';

const UserMenu = () => {
  const { isOpen, menuRef, toggleMenu, isHovered, setIsHovered, handleLogout } = useUserMenu();

  return (
    <UserMenuContainer ref={menuRef}>
      <UserButton
        onClick={toggleMenu}
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      <UserMenuDropdown $isOpen={isOpen}>
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
  );
};

export const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title onClick={() => navigate('/dashboard')}>
          <img 
            src="/digidat.svg" 
            alt="Digidat" 
            style={{ height: '40px' }} 
          />
        </Title>

        <ActionsContainer>
          <ButtonPrimary
            label="Registrar Obra por Impuesto"
            handleClick={() => {
            }}
          />

          <SettingsButton path="/ajustes" />
          
          <UserMenu />
        </ActionsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;