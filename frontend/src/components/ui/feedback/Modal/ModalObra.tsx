import { useState, useEffect } from 'react';
import { Form, Select, Input, DatePicker, message } from 'antd';
import { IoClose } from 'react-icons/io5';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ButtonPrimary } from '../../Buttons/Primary';
import { ButtonSecondary } from '../../Buttons/Secondary';
import { createObra, editObra } from '../../../../services/getObra.service';
import { getTiposObra, type TipoObra } from '../../../../services/getTiposObra.service';
import { centroOperacionService } from '../../../../services/getCentroOperacion.service';
import { userService } from '../../../../services/getUser.service';
import type { ObraResponse } from '../../../../types/obra';
import type { User } from '../../../../types/user';
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
  Sidebar,
  CheckboxGroup,
  Container,
  FormSection
} from './ModalObra.styled';

const { Option } = Select;

interface ModalObraProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: ObraResponse | null;
}

interface CentroOperacion {
  id: number;
  nombre: string;
}

export const ModalObra: React.FC<ModalObraProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [centrosOperacion, setCentrosOperacion] = useState<CentroOperacion[]>([]);
  const [responsables, setResponsables] = useState<User[]>([]);
  const [tipos, setTipos] = useState<TipoObra[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [selectedCentros, setSelectedCentros] = useState<number[]>([]);
  const [selectAllCentros, setSelectAllCentros] = useState(false);
  const [centrosError, setCentrosError] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialData) {
        const centrosIds = initialData.centros_operacion.map(c => c.id);
        setSelectedCentros(centrosIds);
        
        form.setFieldsValue({
          nombre: initialData.nombre,
          tipo_id: initialData.tipo_id,
          id_responsable: initialData.responsable?.id_responsable || null,
          fecha_inicio: initialData.fecha_inicio ? dayjs(initialData.fecha_inicio) : null,
          fecha_fin: initialData.fecha_fin ? dayjs(initialData.fecha_fin) : null,
          costo_proyecto: initialData.costo_proyecto || 0,
        });
      } else {
        form.resetFields();
        setSelectedCentros([]);
        setCentrosError(false);
      }
    }
  }, [isOpen, initialData, form]);

const loadData = async () => {
  try {
    const centros = await centroOperacionService.getCentrosOperacion();
    setCentrosOperacion(centros);

    const users = await userService.getUsers();
    setResponsables(users);

    setLoadingTipos(true);
    const tiposBackend = await getTiposObra();
    setTipos(tiposBackend);
    setLoadingTipos(false);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    message.error('Error al cargar datos del formulario');
    setLoadingTipos(false);
  }
};


  const handleCheckboxChange = (id: number) => {
    setCentrosError(false);
    setSelectedCentros(prev => {
      if (prev.includes(id)) {
        return prev.filter(centroId => centroId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setCentrosError(false);
    setSelectAllCentros(checked);
    if (checked) {
      setSelectedCentros(centrosOperacion.map(c => c.id));
    } else {
      setSelectedCentros([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (selectedCentros.length === 0) {
        setCentrosError(true);
        message.error('Debe seleccionar al menos un centro de operación');
        return;
      }

      setCentrosError(false);
      setLoading(true);

      const obraData: any = {
        nombre: values.nombre,
        tipo_id: values.tipo_id,
        id_responsable: values.id_responsable,
        fecha_inicio: values.fecha_inicio ? values.fecha_inicio.format('YYYY-MM-DD') : null,
        fecha_fin: values.fecha_fin ? values.fecha_fin.format('YYYY-MM-DD') : null,
        costo_proyecto: values.costo_proyecto || 0,
        id_empresa: 1,
        centros_operacion: selectedCentros,
      };


      if (isEditMode && initialData) {
        obraData.id = initialData.id_obra;
        await editObra(obraData);
        message.success('Obra actualizada exitosamente');
      } else {
        const result = await createObra(obraData);
        message.success('Obra creada exitosamente');
      }

      form.resetFields();
      setSelectedCentros([]);
      setCentrosError(false);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error en handleSubmit:', error);
      
      if (error.errorFields) {
        
        const firstError = error.errorFields[0];
        if (firstError && firstError.errors && firstError.errors.length > 0) {
          message.error(firstError.errors[0]);
        }
        
        form.scrollToField(firstError.name);
      } else {
        console.error('Error de API:', error);
        message.error(error.message || 'Error al guardar la obra');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCentros([]);
    setCentrosError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <HeaderModal>
          <span>{isEditMode ? 'Editar Obra por Impuestos' : 'Nueva Obra por Impuestos'}</span>
          <CloseButton onClick={handleCancel}>
            <IoClose size={20} />
          </CloseButton>
        </HeaderModal>

        <Container>
          <Sidebar>
            <div>
              <Label>
                Centro de Operación<Required>*</Required>
              </Label>
              {centrosError && (
                <div style={{ 
                  color: '#ff4d4f', 
                  fontSize: '12px', 
                  marginTop: '4px', 
                  marginBottom: '8px',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Debe seleccionar al menos un centro de operación
                </div>
              )}
              <CheckboxGroup $hasError={centrosError}>
                {centrosOperacion.length > 0 ? (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectAllCentros}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      Todos
                    </label>
                    {centrosOperacion.map((centro) => (
                      <label key={centro.id}>
                        <input
                          type="checkbox"
                          checked={selectedCentros.includes(centro.id)}
                          onChange={() => handleCheckboxChange(centro.id)}
                        />
                        {centro.nombre}
                      </label>
                    ))}
                  </>
                ) : (
                  <p>No hay centros registrados</p>
                )}
              </CheckboxGroup>
            </div>
          </Sidebar>

          <FormSection>
            <FormWrapper>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  nombre: '',
                  tipo_id: undefined,
                  id_responsable: undefined,
                  fecha_inicio: null,
                  fecha_fin: null,
                  costo_proyecto: 0,
                }}
              >
                <FormGrid>
                  {/* Nombre - Ocupa toda la fila */}
                  <div className="full-width">
                    <Form.Item
                      name="nombre"
                      label={
                        <Label>
                          Nombre<Required>*</Required>
                        </Label>
                      }
                      rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                    >
                      <Input placeholder="Nombre de la obra" />
                    </Form.Item>
                  </div>

                  {/* Tipo - Columna izquierda */}
                  <div>
                    <Form.Item
                      name="tipo_id"
                      label={
                        <Label>
                          Tipo de Obra<Required>*</Required>
                        </Label>
                      }
                      rules={[{ required: true, message: 'El tipo es obligatorio' }]}
                    >
                      <Select
                        placeholder="Seleccionar tipo"
                        showSearch
                        loading={loadingTipos}
                        disabled={loadingTipos}
                        optionFilterProp="children"
                        getPopupContainer={() => document.body}
                        dropdownStyle={{ zIndex: 99999 }}
                      >
                        {tipos.map((tipo) => (
                          <Option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  {/* Responsable - Columna derecha */}
                  <div>
                    <Form.Item
                      name="id_responsable"
                      label={
                        <Label>
                          Responsable<Required>*</Required>
                        </Label>
                      }
                      rules={[{ required: true, message: 'El responsable es obligatorio' }]}
                    >
                      <Select 
                        placeholder="Seleccionar responsable"
                        showSearch
                        optionFilterProp="children"
                        getPopupContainer={() => document.body}
                        dropdownStyle={{ zIndex: 99999 }}
                      >
                        {responsables.map((user) => (
                          <Option key={user.id_responsable} value={user.id_responsable}>
                            {user.nombre} {user.cargo && `(${user.cargo})`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  {/* Fecha Inicio - Columna izquierda */}
                  <div>
                    <Form.Item
                      name="fecha_inicio"
                      label={<Label>Fecha de Inicio</Label>}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Seleccionar fecha"
                        suffixIcon={<CalendarOutlined style={{ color: '#C4C4C4' }} />}
                        style={{ width: '100%' }}
                        getPopupContainer={() => document.body}
                        placement="bottomLeft"
                        popupStyle={{ zIndex: 99999 }}
                      />
                    </Form.Item>
                  </div>

                  {/* Fecha Fin - Columna derecha */}
                  <div>
                    <Form.Item
                      name="fecha_fin"
                      label={<Label>Fecha de Conclusión</Label>}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Seleccionar fecha"
                        suffixIcon={<CalendarOutlined style={{ color: '#C4C4C4' }} />}
                        style={{ width: '100%' }}
                        getPopupContainer={() => document.body}
                        placement="bottomLeft"
                        popupStyle={{ zIndex: 99999 }}
                      />
                    </Form.Item>
                  </div>

                  {/* Costo Proyecto - Ocupa toda la fila */}
                  <div className="full-width">
                    <Form.Item
                      name="costo_proyecto"
                      label={<Label>Costo del Proyecto (S/.)</Label>}
                    >
                      <Input
                        type="number"
                        placeholder="Ingresar costo"
                        min={0}
                        step={0.01}
                      />
                    </Form.Item>
                  </div>
                </FormGrid>

                <ButtonGroup>
                  <ButtonSecondary label="Cancelar" handleClick={handleCancel} />
                  <ButtonPrimary
                    label={isEditMode ? 'Actualizar' : 'Guardar'}
                    handleClick={handleSubmit}
                  />
                </ButtonGroup>
              </Form>
            </FormWrapper>
          </FormSection>
        </Container>
      </ModalContainer>
    </Overlay>
  );
};

export default ModalObra;