import { Form, Select, Input } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  EditorWrapper,
  FormWrapper,
} from "./ModalRequisito.styled";
import { useEffect, useState } from "react";
import { getUsers } from "../../../../services/getUser.service";
import { getCategoriasDocumentos } from "../../../../services/getCategoriasDocumentos.service";
import { getTiposFinancista, getTiposContratista } from "../../../../services/getTipoInformacion.service";

export interface EntityData {
  id?: number;
  aspecto: string;
  comentarios: string;
  id_categoria_documento: { id: number; nombre: string }[];
  responsables: { id: number; nombre: string }[];
  id_empresa: number;
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
      if (isLoading) return;
      setIsLoading(true);
      setErrorMessage(null);
      try {
        try {
          const responsablesResponse = await getUsers();
          if (Array.isArray(responsablesResponse)) {
            setResponsablesOptions(
              responsablesResponse.map((resp) => {
                const nombre = resp.nombre || resp.nombre || "Desconocido";
                return {
                  value: resp.id_responsable.toString(),
                  label: nombre,
                };
              })
            );
          } else {
            console.warn("[loadData] Respuesta de responsables no válida:", responsablesResponse);
            setErrorMessage((prev) => prev || "Error al cargar los responsables.");
          }
        } catch (error) {
          console.error("[loadData] Error cargando responsables:", error);
          setErrorMessage((prev) => prev || "Error al cargar los responsables.");
        }

        try {
          const categoriasResponse = await getCategoriasDocumentos();
          if (Array.isArray(categoriasResponse)) {
            setCategoriasOptions(
              categoriasResponse.map((cat) => ({
                value: cat.id.toString(),
                label: cat.nombre || "Desconocida",
              }))
            );
          } else {
            console.warn("[loadData] Respuesta de categorías no válida:", categoriasResponse);
            setErrorMessage((prev) => prev || "Error al cargar las categorías de documentos.");
          }
        } catch (error) {
          console.error("[loadData] Error cargando categorías:", error);
          setErrorMessage((prev) => prev || "Error al cargar las categorías de documentos.");
        }

        try {
          let tiposResponse: { id: number; name: string }[] = [];
          if (tipoFieldName === "id_tipo_financista") {
            tiposResponse = await getTiposFinancista(ID_EMPRESA);
          } else if (tipoFieldName === "id_tipo_contratista") {
            tiposResponse = await getTiposContratista(ID_EMPRESA);
          }
          if (Array.isArray(tiposResponse) && tiposResponse.length > 0) {
            const mappedOptions = tiposResponse.map((tipo) => ({
              value: tipo.id.toString(),
              label: tipo.name || "Sin nombre",
            }));
            setTipoOptions(mappedOptions);
          } else {
            console.warn("[loadData] No se recibieron tipos válidos:", tiposResponse);
            setErrorMessage((prev) => prev || "No se pudieron cargar los tipos.");
          }
        } catch (error) {
          console.error("[loadData] Error cargando tipos:", error);
          setErrorMessage((prev) => prev || "Error al cargar los tipos.");
        }
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

      form.setFieldsValue({
        ...initialData,
        [tipoFieldName]: validTipoValue,
        id_categoria_documento: Array.isArray(initialData.id_categoria_documento)
          ? initialData.id_categoria_documento.map((cat) => cat.id.toString())
          : [],
        responsables: Array.isArray(initialData.responsables)
          ? initialData.responsables.map((resp) => resp.id.toString())
          : [],
        comentarios: initialData.comentarios || "",
        aspecto: initialData.aspecto || "",
      });
    } else {
      form.resetFields();
    }
  }, [initialData, tipoOptions, form, tipoFieldName]);

  const handleSubmit = async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const values = await form.validateFields();

      const formattedValues: T = {
        id: initialData?.id,
        [tipoFieldName]: values[tipoFieldName as string]
          ? parseInt(values[tipoFieldName as string])
          : undefined,
        aspecto: values.aspecto || "",
        comentarios: stripHtml(values.comentarios || ""),
        id_categoria_documento: values.id_categoria_documento
          ? values.id_categoria_documento.map((id: string) => {
              const cat = categoriasOptions.find((opt) => opt.value === id);
              return { id: parseInt(id), nombre: cat?.label || "Desconocida" };
            })
          : [],
        responsables: values.responsables
          ? values.responsables.map((id: string) => {
              const resp = responsablesOptions.find((opt) => opt.value === id);
              return { id: parseInt(id), nombre: resp?.label || "Desconocido" };
            })
          : [],
        id_empresa: ID_EMPRESA,
      } as T;

      if (!formattedValues[tipoFieldName] || isNaN(formattedValues[tipoFieldName] as number)) {
        throw new Error(`El campo ${String(tipoFieldName)} es requerido y debe ser un número válido.`);
      }

      const response = await sendService(formattedValues, formattedValues.id);

      onGuardar(response, formattedValues);
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("[handleSubmit] Error al guardar el requisito:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMsg = error.message.includes("Formato de respuesta")
        ? "La API devolvió una respuesta inesperada. Verifica el endpoint del backend."
        : error.message.includes(tipoFieldName)
        ? `Por favor, seleccione un ${String(tipoFieldName).replace("id_", "")} válido.`
        : `No se pudo guardar el requisito: ${error.message}`;
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <HeaderModal>
          <span>{initialData && Object.keys(initialData).length > 0 ? tituloEditar : tituloNuevo}</span>
          <CloseButton onClick={onClose}>X</CloseButton>
        </HeaderModal>
        <FormWrapper>
          {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}
          <Form form={form} layout="vertical" initialValues={initialData || {}}>
            <FormGrid>
              {campos.map((campo) => (
                <div
                  key={campo.key}
                  className={
                    campo.key === "comentarios"
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
                    {campo.type === "select" ? (
                      <Select
                        mode={campo.multiple ? "multiple" : undefined}
                        placeholder={`Seleccione ${campo.label}`}
                        disabled={campo.disabled || isLoading}
                        allowClear
                        showSearch
                        loading={campo.key === tipoFieldName && isLoading}
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={
                          campo.key === "responsables"
                            ? responsablesOptions
                            : campo.key === "id_categoria_documento"
                            ? categoriasOptions
                            : campo.key === tipoFieldName
                            ? tipoOptions
                            : campo.options || []
                        }
                        notFoundContent={isLoading ? "Cargando..." : "Sin tipos disponibles"}
                      />
                    ) : campo.type === "editor" ? (
                      <EditorWrapper>
                        <ReactQuill
                          theme="snow"
                          value={form.getFieldValue(campo.key) || ""}
                          onChange={(value) => form.setFieldsValue({ [campo.key]: value })}
                        />
                      </EditorWrapper>
                    ) : campo.type === "text" ? (
                      <Input
                        placeholder={`Ingrese ${campo.label}`}
                        disabled={campo.disabled || isLoading}
                        style={{ fontWeight: "normal" }}
                      />
                    ) : (
                      <Input placeholder={`Ingrese ${campo.label}`} />
                    )}
                  </Form.Item>
                </div>
              ))}
            </FormGrid>
            <ButtonGroup>
              <ButtonSecondary label="Cancelar" handleClick={onClose} />
              <ButtonPrimary label="Guardar" handleClick={handleSubmit}/>
            </ButtonGroup>
          </Form>
        </FormWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default FormularioRequisito;