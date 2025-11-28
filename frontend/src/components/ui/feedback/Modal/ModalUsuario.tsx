import { Form, Select, Input } from "antd";
import { ButtonPrimary } from "../../Buttons/Primary";
import { ButtonSecondary } from "../../Buttons/Secondary";
import {
  Overlay,
  ModalContainer,
  HeaderModal,
  CloseButton,
  Label,
  Required,
  ButtonGroup,
  FormGrid,
  FormWrapper,
} from "./ModalUsuario.styled"
import type { User } from "../../../../types/user";
import { IoClose } from 'react-icons/io5';
import React from "react";

const { Option } = Select;

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialData: User | null;
  loading?: boolean;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (isOpen && initialData) {
      const isActive = typeof initialData.estado === 'boolean' 
        ? initialData.estado 
        : initialData.estado === 'ACTIVO';

      form.setFieldsValue({
        nombre: initialData.nombre || '',
        correo: initialData.correo || '',
        id_role: initialData.id_role || 2,
        estado: isActive,
        cargo: initialData.cargo || '',
      });
    } else if (isOpen && !initialData) {
      form.resetFields();
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Error en validación del formulario:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <HeaderModal>
          <span>{initialData ? 'Editar Usuario' : 'Nuevo Usuario'}</span>
          <CloseButton onClick={handleCancel}>
            <IoClose size={14} />
          </CloseButton>
        </HeaderModal>
        
        <FormWrapper>
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
            <FormGrid>
              <div className="full-width">
                <Form.Item
                  name="nombre"
                  label={
                    <Label>
                      Nombre Completo
                      <Required>*</Required>
                    </Label>
                  }
                  rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                >
                  <Input placeholder="Nombre completo" />
                </Form.Item>
              </div>

              <div className="full-width">
                <Form.Item
                  name="correo"
                  label={
                    <Label>
                      Correo Electrónico
                      <Required>*</Required>
                    </Label>
                  }
                  rules={[
                    { required: true, message: 'Por favor ingrese el correo' },
                    { type: 'email', message: 'Ingrese un correo válido' },
                  ]}
                >
                  <Input placeholder="correo@ejemplo.com" />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="cargo"
                  label={
                    <Label>
                      Cargo
                      <Required>*</Required>
                    </Label>
                  }
                  rules={[{ required: true, message: 'Por favor ingrese el cargo' }]}
                >
                  <Input placeholder="Ej: Desarrollador, Analista, etc." />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="id_role"
                  label={
                    <Label>
                      Rol
                      <Required>*</Required>
                    </Label>
                  }
                  rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
                >
                  <Select placeholder="Seleccione un rol">
                    <Option value={1}>Administrador</Option>
                    <Option value={2}>Usuario</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="full-width">
                <Form.Item
                  name="estado"
                  label={
                    <Label>
                      Estado
                      <Required>*</Required>
                    </Label>
                  }
                  rules={[{ required: true, message: 'Por favor seleccione un estado' }]}
                >
                  <Select placeholder="Seleccione un estado">
                    <Option value={true}>Activo</Option>
                    <Option value={false}>Inactivo</Option>
                  </Select>
                </Form.Item>
              </div>
            </FormGrid>

            <ButtonGroup>
              <ButtonSecondary label="Cancelar" handleClick={handleCancel} />
              <ButtonPrimary 
                label="Guardar" 
                handleClick={handleSubmit}
              />
            </ButtonGroup>
          </Form>
        </FormWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ModalUsuario;