import { useState, useEffect } from "react";
import { Table, message, Tag, Button, Modal, Form, Input, Select, Space, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AjustesContainer } from "./index.styled";
import Header from "../../components/Header";
import { userService } from '../../services/getUser.service';
import type { User } from '../../types/user';
import ModalEliminar from '../../components/Modal/ModalEliminar';
import { ButtonPrimary } from '../../components/Buttons/Primary';

const { Column } = Table;
const { Option } = Select;


const Ajustes = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

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
    form.setFieldsValue({
      nombre: user?.nombre || '',
      correo: user?.correo || '',
      id_role: user?.id_role || 2,
      estado: user?.estado || 'INACTIVO',
      cargo: user?.cargo || ''
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      if (editingUser) {
        // Update existing user
        const updateData = {
          ...values,
          id_responsable: editingUser.id_responsable,
          estado: values.estado ? 'ACTIVO' : 'INACTIVO',
        };
        
        await userService.updateUser(editingUser.id_responsable, updateData);
        message.success('Usuario actualizado correctamente');
      } else {
        // Create new user
        const createData = {
          ...values,
          estado: values.estado ? 'ACTIVO' : 'INACTIVO',
          password: '12345678',
        };
        
        await userService.createUser(createData);
        message.success('Usuario creado correctamente');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al guardar el usuario:', error);
      if (!errorMessage.includes('validation')) {
        message.error(`Error al guardar el usuario: ${errorMessage}`);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
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
    form.resetFields();
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este usuario?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      onOk: async () => {
        try {
          await userService.deleteUser(id);
          message.success('Usuario eliminado correctamente');
          fetchUsers();
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          message.error('Error al eliminar el usuario');
        }
      },
    });
  };
  const renderUserTable = () => (
    <>
      <div style={{ marginBottom: 16 }}>
        <ButtonPrimary 
          label="Agregar Usuario"
          handleClick={() => showModal()}
        />
          </div>
          <Table
            dataSource={users}
            rowKey="id_responsable"
            pagination={{
              pageSize: 10, 
              showSizeChanger: false,
              showTotal: (total: number) => `Total ${total} usuarios`
            }}
            scroll={{ x: true }}
          >
            <Column title="ID" dataIndex="id_responsable" key="id_responsable" width={80} />
            <Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Column title="Correo" dataIndex="correo" key="correo" />
            <Column
              title="Estado"
              key="estado"
              render={(_: unknown, user: User) => (
                <Tag color={user.estado ? 'green' : 'red'}>
                  {user.estado ? 'Activo' : 'Inactivo'}
                </Tag>
              )}
              width={100}
            />
            <Column
              title="Rol"
              key="rol"
              render={(_: unknown, user: User) => (
                <span>{user.id_role === 1 ? 'Administrador' : 'Usuario'}</span>
              )}
              width={120}
            />
            <Column title="Cargo" dataIndex="cargo" key="cargo" />
            <Column
              title="Acciones"
              key="accion"
              fixed="right"
              width={120}
              render={(_: unknown, user: User) => (
                <Space size="middle">
                  <Button 
                    type="link" 
                    icon={<EditOutlined />} 
                    onClick={() => showModal(user)}
                    title="Editar"
                  />
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteClick(user.id_responsable)}
                    title="Eliminar"
                  />
                </Space>
              )}
            />
            
          </Table>
          <Modal
            title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            open={isModalVisible}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ 
                estado: true, 
                id_role: 2,
                nombre: '',
                correo: '',
                cargo: ''
              }}
            >
              <Form.Item
                name="nombre"
                label="Nombre Completo"
                rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
              >
                <Input placeholder="Nombre completo" />
              </Form.Item>

              <Form.Item
                name="correo"
                label="Correo Electrónico"
                rules={[
                  { required: true, message: 'Por favor ingrese el correo' },
                  { type: 'email', message: 'Ingrese un correo válido' },
                ]}
              >
                <Input placeholder="correo@ejemplo.com" />
              </Form.Item>

              <Form.Item
                name="cargo"
                label="Cargo"
                rules={[{ required: true, message: 'Por favor ingrese el cargo' }]}
              >
                <Input placeholder="Ej: Desarrollador, Analista, etc." />
              </Form.Item>

              <Form.Item
                name="id_role"
                label="Rol"
                rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
              >
                <Select placeholder="Seleccione un rol">
                  <Option value={1}>Administrador</Option>
                  <Option value={2}>Usuario</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="estado"
                label="Estado"
                rules={[{ required: true, message: 'Por favor seleccione un estado' }]}
              >
                <Select placeholder="Seleccione un estado">
                  <Option value={true}>Activo</Option>
                  <Option value={false}>Inactivo</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
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
      <Header title="Ajustes" />
      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={(key: string) => setActiveTab(key)}
        size="large"
      />
    </AjustesContainer>
  );
};

export default Ajustes;