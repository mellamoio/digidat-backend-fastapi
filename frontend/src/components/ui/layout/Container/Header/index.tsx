import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsButton } from "../../../Buttons/SettingsButton";
import { ButtonPrimary } from "../../../Buttons/Primary";
import { UserButton } from "../../../Buttons/UserButton";
import { useUserMenu } from '../../../../../hooks/useUserMenu';
import { useAuth } from '../../../../../hooks/useAuth';
import { UserSwitchOutlined, LogoutOutlined } from '@ant-design/icons';
import { ModalObra } from '../../../feedback/Modal/ModalObra';
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
  const { user } = useAuth();

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
          <span>{user?.name || 'Mi Perfil'}</span>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleObraCreated = () => {
    setIsModalOpen(false);
    window.dispatchEvent(new Event('obraCreated'));
  };

  return (
    <>
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
              handleClick={handleOpenModal}
            />

            {/* MOSTRAR SOLO SI ES ADMIN */}
            {isAdmin && <SettingsButton path="/ajustes" />}
            
            <UserMenu />
          </ActionsContainer>
        </HeaderContent>
      </HeaderContainer>

      {/* Modal de Obra */}
      <ModalObra
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleObraCreated}
        initialData={null}
      />
    </>
  );
};

export default Header;