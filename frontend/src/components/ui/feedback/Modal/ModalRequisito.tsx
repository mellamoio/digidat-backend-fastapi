import { Form, Select, Input } from "antd";
import { ButtonPrimary } from "../../../../components/ui/Buttons/Primary";
import { ButtonSecondary } from "../../../../components/ui/Buttons/Secondary";
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
} from "./ModalRequisito.styled";
import { useEffect, useState } from "react";
import { getUsers } from "../../../../services/getUser.service";
import { fetchCategoriasDocumento } from "../../../../services/getCategoriasDocumentos.service";

const { TextArea } = Input;


export interface EntityData {
  id?: number;
  aspecto?: string;
  comentarios?: string;
  id_categoria_documento?: { id: number; nombre: string }[];
  responsables?: { id: number; nombre: string }[];
  id_empresa?: number;
  [key: string]: any;
}


export interface CampoFormulario {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  disabled?: boolean;
  rows?: number;
}


interface FormularioRequisitoProps<T extends EntityData> {
  onClose: () => void;
  initialData: T | null;
  onGuardar: (response: T, formattedValues?: T) => void;
  tituloNuevo: string;
  tituloEditar: string;
  campos: CampoFormulario[];
  sendService: (data: T, id?: number) => Promise<T>;
  tipoFieldName: keyof T;
}


const ID_EMPRESA = 1;


const FormularioRequisito = <T extends EntityData>({
  onClose,
  initialData,
  onGuardar,
  tituloNuevo,
  tituloEditar,
  campos,
  sendService,
  tipoFieldName,
}: FormularioRequisitoProps<T>) => {
  const [form] = Form.useForm();
  const [responsablesOptions, setResponsablesOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoriasOptions, setCategoriasOptions] = useState<{ value: string; label: string }[]>([]);
  const [tipoOptions, setTipoOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        try {
          const responsablesResponse = await getUsers();
          if (Array.isArray(responsablesResponse)) {
            setResponsablesOptions(
              responsablesResponse.map((resp) => ({
                value: resp.id_responsable.toString(),
                label: resp.nombre || "Desconocido",
              }))
            );
          }
        } catch (error) {
          console.error("[loadData] Error cargando responsables:", error);
        }

        try {
          const categoriasResponse = await fetchCategoriasDocumento();
          if (Array.isArray(categoriasResponse)) {
            setCategoriasOptions(
              categoriasResponse.map((cat) => ({
                value: cat.id_categoria.toString(),
                label: cat.nombre,
              }))
            );
          }
        } catch (error) {
          console.error("[loadData] Error cargando categorías:", error);

          setCategoriasOptions([
            { value: "1", label: "Documentos Legales" },
            { value: "2", label: "Documentos Técnicos" },
            { value: "3", label: "Documentos Administrativos" },
            { value: "4", label: "Planos y Diseños" },
            { value: "5", label: "Permisos y Licencias" },
          ]);
        }

        if (tipoFieldName === "id_tipo_financista") {
          setTipoOptions([
            { value: "1", label: "Requisito Legal" },
            { value: "2", label: "Información Financiera" },
          ]);
        } else if (tipoFieldName === "id_tipo_contratista") {
          setTipoOptions([
            { value: "1", label: "Empresa Constructora" },
            { value: "2", label: "Empresa Supervisora" },
          ]);
        }
      } catch (error) {
        console.error("[loadData] Error general:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [tipoFieldName]);


  useEffect(() => {
    if (initialData) {
      const tipoValue = initialData[tipoFieldName] ? String(initialData[tipoFieldName]) : undefined;
      const validTipoValue = tipoValue && tipoOptions.some((opt) => opt.value === tipoValue) ? tipoValue : undefined;

      const formValues: any = {
        ...initialData,
        [tipoFieldName]: validTipoValue,
      };

      if (initialData.id_categoria_documento && Array.isArray(initialData.id_categoria_documento)) {
        formValues.id_categoria_documento = initialData.id_categoria_documento.map((cat) => 
          cat.id.toString()
        );
      }

      if (initialData.responsables && Array.isArray(initialData.responsables)) {
        formValues.responsables = initialData.responsables.map((resp) => 
          resp.id.toString()
        );
      }

      if (initialData.id_responsable) {
        formValues.id_responsable = String(initialData.id_responsable);
      }

      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [initialData, tipoOptions, form, tipoFieldName]);


  const handleSubmit = async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues: any = {
        id: initialData?.id,
        ...values,
      };

      if (values[tipoFieldName as string] !== undefined) {
        formattedValues[tipoFieldName] = parseInt(values[tipoFieldName as string]);
      }

      if (values.id_categoria_documento) {
        formattedValues.id_categoria_documento = values.id_categoria_documento.map((id: string) => {
          const cat = categoriasOptions.find((opt) => opt.value === id);
          return { id: parseInt(id), nombre: cat?.label || "Desconocida" };
        });
      }

      if (values.responsables) {
        formattedValues.responsables = values.responsables.map((id: string) => {
          const resp = responsablesOptions.find((opt) => opt.value === id);
          return { id: parseInt(id), nombre: resp?.label || "Desconocido" };
        });
      }

      if (values.id_responsable) {
        formattedValues.id_responsable = parseInt(values.id_responsable);
      }

      if (values.comentarios) {
        formattedValues.comentarios = values.comentarios;
      }

      formattedValues.id_empresa = ID_EMPRESA;
      
      if (!formattedValues.id_obra && initialData?.id_obra) {
        formattedValues.id_obra = initialData.id_obra;
      }

      const response = await sendService(formattedValues as T, formattedValues.id);

      onGuardar(response, formattedValues as T);
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("[handleSubmit] Error:", error);
      
      const errorMsg = error.message?.includes(tipoFieldName as string)
        ? `Por favor, seleccione un ${String(tipoFieldName).replace("id_", "")} válido.`
        : `No se pudo guardar: ${error.message || "Error desconocido"}`;
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  const renderField = (campo: CampoFormulario) => {
    switch (campo.type) {
      case "select":
        return (
          <Select
            mode={campo.multiple ? "multiple" : undefined}
            placeholder={`Seleccione ${campo.label}`}
            disabled={campo.disabled || isLoading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              campo.key === "responsables" || campo.key === "id_responsable"
                ? responsablesOptions
                : campo.key === "id_categoria_documento"
                ? categoriasOptions
                : campo.key === tipoFieldName
                ? tipoOptions
                : campo.options || []
            }
            notFoundContent={isLoading ? "Cargando..." : "Sin opciones disponibles"}
          />
        );

      case "textarea":
        return (
          <TextArea
            placeholder={`Ingrese ${campo.label}`}
            disabled={campo.disabled || isLoading}
            rows={campo.rows || 4}
            style={{ fontWeight: "normal" }}
          />
        );

      case "text":
        return (
          <Input
            placeholder={`Ingrese ${campo.label}`}
            disabled={campo.disabled || isLoading}
            style={{ fontWeight: "normal" }}
          />
        );

      default:
        return <Input placeholder={`Ingrese ${campo.label}`} />;
    }
  };


  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <HeaderModal>
          <span>{initialData && Object.keys(initialData).length > 0 ? tituloEditar : tituloNuevo}</span>
          <CloseButton onClick={onClose}>X</CloseButton>
        </HeaderModal>
        <FormWrapper>
          {errorMessage && (
            <div style={{ 
              color: "red", 
              background: "#fff2f0", 
              border: "1px solid #ffccc7",
              borderRadius: "4px",
              padding: "10px", 
              marginBottom: "15px" 
            }}>
              {errorMessage}
            </div>
          )}
          <Form form={form} layout="vertical" initialValues={initialData || {}}>
            <FormGrid>
              {campos.map((campo) => (
                <div
                  key={campo.key}
                  className={
                    campo.key === "comentarios" || campo.key === "detalle"
                      ? "full-width"
                      : campo.key === "id_categoria_documento"
                      ? "categorias"
                      : campo.key === "responsables"
                      ? "responsables"
                      : campo.key === "aspecto"
                      ? "aspecto"
                      : ""
                  }
                >
                  <Form.Item
                    name={campo.key}
                    label={
                      <Label>
                        {campo.label}
                        {campo.required && <Required>*</Required>}
                      </Label>
                    }
                    rules={[{ required: campo.required, message: `${campo.label} es requerido` }]}
                  >
                    {renderField(campo)}
                  </Form.Item>
                </div>
              ))}
            </FormGrid>
            <ButtonGroup>
              <ButtonSecondary label="Cancelar" handleClick={onClose} />
              <ButtonPrimary label={isLoading ? "Guardando..." : "Guardar"} handleClick={handleSubmit} />
            </ButtonGroup>
          </Form>
        </FormWrapper>
      </ModalContainer>
    </Overlay>
  );
};


export default FormularioRequisito;