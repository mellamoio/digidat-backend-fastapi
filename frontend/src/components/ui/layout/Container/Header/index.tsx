// frontend/src/components/ui/layout/Container/Header/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsButton } from "../../../Buttons/SettingsButton";
import { ButtonPrimary } from "../../../Buttons/Primary";
import { UserButton } from "../../../Buttons/UserButton";
import { useUserMenu } from '../../../../../hooks/useUserMenu';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleObraCreated = () => {
    console.log('Obra creada exitosamente');
    setIsModalOpen(false);
    // Disparar evento para refrescar la tabla
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

            <SettingsButton path="/ajustes" />
            
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