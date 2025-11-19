import { useState, useEffect } from "react";
import { message, Tabs, Tag } from "antd";
import type { TabsProps } from 'antd';
import type { TableColumn } from 'react-data-table-component';
import { AjustesContainer, ContentContainer } from "./index.styled";
import Header from "../../components/ui/layout/Container/Header";
import { userService } from '../../services/getUser.service';
import type { User } from '../../types/user';
import ModalEliminar from '../../components/ui/feedback/Modal/ModalEliminar';
import ModalUsuario from '../../components/ui/feedback/Modal/ModalUsuario';
import { ButtonPrimary } from '../../components/ui/Buttons/Primary';
import { DataTableCustom } from '../../components/ui/data-display/DataTableCustom';

const Ajustes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      message.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setConfirmLoading(true);
      
      if (editingUser) {
        const updateData = {
          ...values,
          id_responsable: editingUser.id_responsable,
          estado: values.estado ? 'ACTIVO' : 'INACTIVO',
        };
        
        await userService.updateUser(editingUser.id_responsable, updateData);
        message.success('Usuario actualizado correctamente');
      } else {
        const createData = {
          ...values,
          estado: values.estado ? 'ACTIVO' : 'INACTIVO',
          password: '12345678',
        };
        
        await userService.createUser(createData);
        message.success('Usuario creado correctamente');
      }
      
      setIsModalVisible(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al guardar el usuario:', error);
      if (!errorMessage.includes('validation')) {
        message.error(`Error al guardar el usuario: ${errorMessage}`);
      }
      throw error;
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user.id_responsable);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete);
      message.success('Usuario eliminado correctamente');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      message.error('Error al eliminar el usuario');
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const userColumns: TableColumn<User>[] = [
    {
      name: 'ID',
      selector: (row: User) => row.id_responsable,
      sortable: true,
      center: true,
      width: '80px',
    },
    {
      name: 'Nombre',
      selector: (row: User) => row.nombre || 'Sin nombre',
      sortable: true,
      center: true,
      grow: 2,
    },
    {
      name: 'Correo',
      selector: (row: User) => row.correo || 'Sin correo',
      sortable: true,
      center: true,
      grow: 2,
    },
    {
      name: 'Cargo',
      selector: (row: User) => row.cargo || 'Sin cargo',
      sortable: true,
      center: true,
      grow: 1.5,
    },
    {
      name: 'Rol',
      cell: (row: User) => (
        <Tag color={row.id_role === 1 ? 'blue' : 'default'}>
          {row.id_role === 1 ? 'Administrador' : 'Usuario'}
        </Tag>
      ),
      sortable: true,
      center: true,
      width: '140px',
    },
    {
      name: 'Estado',
      cell: (row: User) => {
        const isActive = typeof row.estado === 'boolean' 
          ? row.estado 
          : row.estado === 'ACTIVO';
        
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Tag>
        );
      },
      sortable: true,
      center: true,
      width: '120px',
    },
  ];

  const renderUserTable = () => (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonPrimary 
          label="Agregar Usuario"
          handleClick={() => showModal()}
        />
      </div>
      
      <DataTableCustom
        title=""
        columns={userColumns}
        data={users}
        totalRows={users.length}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={(user: User) => showModal(user)}
        onDelete={handleDeleteClick}
        emptyText="No existen usuarios registrados"
        stickyColumns={true}
      />

      <ModalUsuario
        isOpen={isModalVisible}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        initialData={editingUser}
        loading={confirmLoading}
      />

      <ModalEliminar
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        mensaje="¿Estás seguro de que deseas eliminar este usuario?"
      />
    </>
  );

  const items: TabsProps['items'] = [
    {
      key: 'usuarios',
      label: 'Usuarios',
      children: renderUserTable(),
    },
    {
      key: 'configuracion',
      label: 'Configuración',
      children: 'Configuración del sistema',
    },
  ];

  return (
    <AjustesContainer>
      <Header />
      <ContentContainer>
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={(key: string) => setActiveTab(key)}
          size="large"
        />
      </ContentContainer>
    </AjustesContainer>
  );
};

export default Ajustes;