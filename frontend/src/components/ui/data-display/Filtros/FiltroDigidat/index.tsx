import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState, useEffect, useMemo } from "react";
import { FiltroVerticalContainer, IconWrapper, Column, FilterButtons, StyledButton } from "./index.styled";
import { FaFilter } from "react-icons/fa";
import FiltroFechas from "../FiltroFechas";
import { useObras } from "../../../../../context/ObrasContext";
import { useSatelite } from "../../../../../context/DigidatContext";
import { getCentrosOperacion } from "../../../../../services/getCentroOperacion.service";
import type { CentroOperacion } from "../../../../../services/getCentroOperacion.service";
import { getTiposObra } from "../../../../../services/getTiposObra.service";
import type { TipoObra } from "../../../../../services/getTiposObra.service";

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
  const { obras, obrasFiltradas, params, setParams } = useObras();
  const { usuarios } = useSatelite();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState<string | undefined>(undefined);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("0");

  const [centrosOperacion, setCentrosOperacion] = useState<CentroOperacion[]>([]);
  const [loadingCentros, setLoadingCentros] = useState(false);

  const [tiposObra, setTiposObra] = useState<TipoObra[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  useEffect(() => {
    const fetchCentros = async () => {
      setLoadingCentros(true);
      try {
        const centros = await getCentrosOperacion();
        setCentrosOperacion(centros || []);
      } catch (error) {
        console.error("Error al cargar centros de operación:", error);
        setCentrosOperacion([]);
      } finally {
        setLoadingCentros(false);
      }
    };

    fetchCentros();
  }, []);

  useEffect(() => {
    const fetchTipos = async () => {
      setLoadingTipos(true);
      try {
        const tipos = await getTiposObra();
        setTiposObra(tipos || []);
      } catch (error) {
        console.error("Error al cargar tipos de obra:", error);
        setTiposObra([]);
      } finally {
        setLoadingTipos(false);
      }
    };

    fetchTipos();
  }, []);

  const conteoPorTipo = useMemo(() => {
    if (!obrasFiltradas) {
      return { todos: 0, porTipo: {} as Record<number, number> };
    }

    const porTipo: Record<number, number> = {};
    for (const obra of obrasFiltradas) {
      const idTipo = obra.tipo_id;
      if (!porTipo[idTipo]) porTipo[idTipo] = 0;
      porTipo[idTipo]++;
    }

    return {
      todos: obrasFiltradas.length,
      porTipo,
    };
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

  const handleBeneficiariosChange = (value: string[]) => {
    setParams({ ...params, centros_operacion: value.length > 0 ? value : undefined });
  };

  const handleUsuariosChange = (value: string[]) => {
    setParams({ ...params, usuarios: value.length > 0 ? value : undefined });
  };

  return (
    <FiltroVertical isCollapsed={isCollapsed} toggleCollapse={toggleCollapse}>
      <Column gap={12} isCollapsed={isCollapsed}>
        <SelectFiltro
          showSearch
          label="Obra por Impuesto"
          placeholder="Buscar obra..."
          options={
            obras
              ? obras.map((obra) => ({ label: obra.nombre, value: obra.id.toString() }))
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
            <StyledButton
              selected={tipoSeleccionado === "0"}
              onClick={() => handleTipoChange("0")}
            >
              Todos ({conteoPorTipo.todos})
            </StyledButton>

            {tiposObra.map((tipo) => (
              <StyledButton
                key={tipo.id}
                selected={tipoSeleccionado === tipo.id.toString()}
                onClick={() => handleTipoChange(tipo.id.toString())}
                disabled={loadingTipos}
              >
                {tipo.nombre} ({conteoPorTipo.porTipo[tipo.id] || 0})
              </StyledButton>
            ))}
          </FilterButtons>
        </div>

        <SelectFiltro
          showSearch
          mode="multiple"
          placeholder="Buscar beneficiarios..."
          label="Beneficiarios Involucrados (Centros de Operación)"
          value={params.centros_operacion || []}
          options={centrosOperacion.map((centro) => ({
            label: centro.nombre,
            value: centro.id.toString(),
          }))}
          handleChange={handleBeneficiariosChange}
          disabled={loadingCentros}
        />

        <SelectFiltro
          showSearch
          label="Responsables"
          placeholder="Buscar responsables..."
          mode="multiple"
          value={params.usuarios || []}
          options={usuarios.map((usuario) => ({
            label: usuario.nombre,
            value: usuario.id_responsable.toString(),
          }))}
          handleChange={handleUsuariosChange}
        />
      </Column>
    </FiltroVertical>
  );
};

export default FiltroVerticalDigidat;