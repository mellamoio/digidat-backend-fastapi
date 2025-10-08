import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState, useEffect, useMemo } from "react";
import { FiltroVerticalContainer, IconWrapper, Column, FilterButtons, StyledButton } from "./index.styled";
import { FaFilter } from "react-icons/fa";
import FiltroFechas from "../FiltroFechas";
import type { Dayjs } from 'dayjs';

// Definición de interfaces
interface Responsable {
  id: number;
  nombres: string;
  apellidos?: string;
  email?: string;
}

interface Obra {
  id: number;
  nombre: string;
  tipo_id?: number;
}

interface UseSateliteActoresReturn {
  obras: Obra[];
  obrasFiltradas: Obra[];
  params: {
    obra_id?: number;
    tipo?: string;
    grupo_interes_id?: number;
    grupo_interes_persona_id?: number;
    responsables?: string[];
    fecha_inicio?: Dayjs;
    fecha_fin?: Dayjs;
    [key: string]: any;
  };
  setParams: (params: any) => void;
  resetFilters: () => void;
}

const getResponsables = async (): Promise<Responsable[]> => {
  return [];
};

const useSateliteActores = (): UseSateliteActoresReturn => {
  const [params, setParams] = useState<any>({});
  const [obras, setObras] = useState<Obra[]>([]);
  const [obrasFiltradas, setObrasFiltradas] = useState<Obra[]>([]);

  const resetFilters = () => {
    setParams({});
  };

  useEffect(() => {
  }, []);

  return {
    obras,
    obrasFiltradas,
    params,
    setParams,
    resetFilters
  };
};

const FilterIcon = () => <FaFilter size={18} color="#C4C4C4" />;

interface SelectFiltroProps {
  mode?: "multiple" | "tags";
  handleChange?: (value: any) => void;
  options: DefaultOptionType[];
  placeholder?: string;
  label?: string | React.ReactNode;
  value: any;
  showSearch?: boolean;
  disabled?: boolean;
  filterOption?: (input: string, option: any) => boolean;
  allowClear?: boolean;
  style?: React.CSSProperties;
}

const SelectFiltro = ({
  mode,
  handleChange,
  placeholder,
  options,
  label,
  value,
  showSearch,
  disabled,
}: SelectFiltroProps) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <Select
        showSearch={showSearch}
        filterOption={(input, option) =>
          (option?.label?.toString() ?? "").toLowerCase().includes(input.toLowerCase())
        }
        allowClear
        mode={mode}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        style={{ width: "100%" }}
      />
    </div>
  );
};

interface FiltroVerticalProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const FiltroVertical: React.FC<FiltroVerticalProps> = ({ children, isCollapsed, toggleCollapse }) => {
  return (
    <FiltroVerticalContainer isCollapsed={isCollapsed}>
      <IconWrapper onClick={toggleCollapse}>
        <FilterIcon />
      </IconWrapper>
      <Column gap={12} isCollapsed={isCollapsed}>
        {children}
      </Column>
    </FiltroVerticalContainer>
  );
};

const FiltroVerticalDigidat: React.FC = () => {
  const { obras, obrasFiltradas, params, setParams, resetFilters } = useSateliteActores();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState<string | undefined>(undefined);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | undefined>("0");
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [loadingResponsables, setLoadingResponsables] = useState(false);

  useEffect(() => {
    const fetchResponsablesData = async () => {
      setLoadingResponsables(true);
      try {
        const responsablesData = await getResponsables();
        setResponsables(responsablesData || []);
      } catch (error: any) {
        console.error("Error al cargar responsables:", error.response?.data || error.message);
        setResponsables([]);
      } finally {
        setLoadingResponsables(false);
      }
    };

    fetchResponsablesData();
  }, []);

  const conteoPorTipo = useMemo(() => {
    if (!obrasFiltradas) return { todos: 0, tipo1: 0, tipo2: 0, tipo3: 0, tipo4: 0 };

    const tipo1 = obrasFiltradas.filter((obra) => obra.tipo_id === 1).length;
    const tipo2 = obrasFiltradas.filter((obra) => obra.tipo_id === 2).length;
    const tipo3 = obrasFiltradas.filter((obra) => obra.tipo_id === 3).length;
    const tipo4 = obrasFiltradas.filter((obra) => obra.tipo_id === 4).length;
    const todos = obrasFiltradas.length;

    return { todos, tipo1, tipo2, tipo3, tipo4 };
  }, [obrasFiltradas]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleObraChange = (value: string) => {
    setObraSeleccionada(value);
    setParams({ ...params, obra_id: value ? parseInt(value) : undefined });
  };

  const handleTipoChange = (tipo: string) => {
    setTipoSeleccionado(tipo);
    setParams({ ...params, tipo: tipo === "0" ? undefined : tipo });
  };

  const handleNombreSelectChange = (value: string) => {
    if (value) {
      const [id, tipoRegistro] = value.split("_");
      if (tipoRegistro === "grupo-interes") {
        setParams({
          ...params,
          grupo_interes_id: parseInt(id),
          grupo_interes_persona_id: undefined,
        });
      } else if (tipoRegistro === "participante") {
        setParams({
          ...params,
          grupo_interes_id: undefined,
          grupo_interes_persona_id: parseInt(id),
        });
      }
    } else {
      setParams({
        ...params,
        grupo_interes_id: undefined,
        grupo_interes_persona_id: undefined,
      });
    }
  };

  const handleResponsablesChange = (value: string[]) => {
    setParams({ ...params, responsables: value.length > 0 ? value : undefined });
  };


  return (
    <FiltroVertical isCollapsed={isCollapsed} toggleCollapse={toggleCollapse}>
      <Column gap={12} isCollapsed={isCollapsed}>
        <SelectFiltro
          showSearch
          label="Obra por Impuesto"
          placeholder="Seleccionar"
          options={
            obras
              ? (obras as Obra[]).map((obra) => ({ label: obra.nombre, value: obra.id.toString() }))
              : []
          }
          value={obraSeleccionada}
          handleChange={handleObraChange}
        />
        <label>Rango de tiempo</label>
        <FiltroFechas 
          params={params}
          setParams={setParams}
        />
        <div>
          <label>Tipos</label>
          <FilterButtons>
            <StyledButton selected={tipoSeleccionado === "0"} onClick={() => handleTipoChange("0")}>
              Todos ({conteoPorTipo.todos})
            </StyledButton>
            <StyledButton selected={tipoSeleccionado === "1"} onClick={() => handleTipoChange("1")}>
              Proyecto de inversión ({conteoPorTipo.tipo1})
            </StyledButton>
            <StyledButton selected={tipoSeleccionado === "2"} onClick={() => handleTipoChange("2")}>
              IOARR ({conteoPorTipo.tipo2})
            </StyledButton>
            <StyledButton selected={tipoSeleccionado === "3"} onClick={() => handleTipoChange("3")}>
              IOARR de emergencia ({conteoPorTipo.tipo3})
            </StyledButton>
            <StyledButton selected={tipoSeleccionado === "4"} onClick={() => handleTipoChange("4")}>
              Operación ({conteoPorTipo.tipo4})
            </StyledButton>
          </FilterButtons>
        </div>
        <SelectFiltro
          showSearch
          placeholder="Beneficiarios"
          label="Beneficiarios Involucrados"
          value={
            params.grupo_interes_id
              ? `${params.grupo_interes_id}_grupo-interes`
              : params.grupo_interes_persona_id
              ? `${params.grupo_interes_persona_id}_participante`
              : null
          }
          options={[]}
          handleChange={handleNombreSelectChange}
        />
        <SelectFiltro
          showSearch
          label="Responsables"
          placeholder="Responsables"
          mode="multiple"
          value={params.responsables || []}
          options={responsables.map((resp) => ({
            label: resp.nombres,
            value: resp.id.toString(),
          }))}
          handleChange={handleResponsablesChange}
          disabled={loadingResponsables}
        />
      </Column>
    </FiltroVertical>
  );
};

export default FiltroVerticalDigidat;