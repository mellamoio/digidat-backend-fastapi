import React, { useEffect, useState } from "react";
import api from "../../../../api/api";
import { FiltroContainer, InputWrapper, Label, IconWrapper, Column } from "./index.styled";
import { FaSearch, FaFilter } from "react-icons/fa";
import { Select, Dropdown, Button, DatePicker, message, Input as AntdInput } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import type { MenuProps } from "antd";

const { RangePicker } = DatePicker;

const YearButton = styled(Button)`
  min-width: 65px;
  padding: 5px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
  background: #868686;
  color: white;
  border-radius: 4px;
`;

const StyledRangePicker = styled(RangePicker)`
  max-width: 210px;
  padding: 5px 8px;
  width: 100%;
  .ant-picker-suffix {
    display: none;
  }
`;

const StyledAntdInput = styled(AntdInput)`
  max-width: 210px;
  padding: 5px 8px;
  width: 100%;
`;

interface FiltroValues {
  year: string;
  fechaInicio: string;
  fechaFin: string;
  concepto: string;
  beneficiario: string[];
}

interface FiltroPagosProps {
  onFilterChange: (filters: FiltroValues) => void;
  beneficiarios: string[];
  id_obra?: number;
  setIsCollapsed: (value: boolean) => void;
  isCollapsed: boolean;
}

export const FiltroPagos: React.FC<FiltroPagosProps> = ({
  onFilterChange,
  beneficiarios,
  id_obra,
  setIsCollapsed,
  isCollapsed,
}) => {
  const [filters, setFilters] = useState<FiltroValues>({
    year: dayjs().year().toString(),
    fechaInicio: dayjs().startOf("year").format("YYYY-MM-DD"),
    fechaFin: dayjs().endOf("year").format("YYYY-MM-DD"),
    concepto: "",
    beneficiario: [],
  });
  const [years, setYears] = useState<string[]>([]);

  const fetchYears = async () => {
    try {
      const response = await api.get("/all/pagosoi", {
        params: {
          id_obra,
        },
      });

      const pagos = response.data.data || response.data;
      if (Array.isArray(pagos)) {
        const uniqueYears = Array.from(
          new Set(pagos.map((pago: any) => new Date(pago.fecha).getFullYear().toString()))
        );
        setYears(uniqueYears);
      } else {
        setYears([]);
      }
    } catch (error: any) {
      console.error("Error al cargar los años:", error);
      message.error(`Error al cargar los años: ${error.message}`);
      setYears([]);
    }
  };

  useEffect(() => {
    if (id_obra !== undefined) {
      fetchYears();
    }
    onFilterChange(filters);
  }, [id_obra]);

  const generateYears = (numYears: number) => {
    const currentYear = dayjs().year();
    return Array.from({ length: numYears }, (_, i) => (currentYear - i).toString());
  };

  const handleYearChange = (year: string) => {
    const newYear = year || dayjs().year().toString();
    const newDateRange: [Dayjs, Dayjs] = [dayjs(`${newYear}-01-01`), dayjs(`${newYear}-12-31`)];
    const newFilters = {
      ...filters,
      year: newYear,
      fechaInicio: newDateRange[0].format("YYYY-MM-DD"),
      fechaFin: newDateRange[1].format("YYYY-MM-DD"),
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      const newYear = dates[0].year().toString();
      const newFilters = {
        ...filters,
        year: newYear,
        fechaInicio: dates[0].format("YYYY-MM-DD"),
        fechaFin: dates[1].format("YYYY-MM-DD"),
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = {
        ...filters,
        fechaInicio: dayjs(`${filters.year}-01-01`).format("YYYY-MM-DD"),
        fechaFin: dayjs(`${filters.year}-12-31`).format("YYYY-MM-DD"),
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleChange = (name: string, value: string | string[]) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const yearMenu: MenuProps = {
    items: generateYears(7).map((year) => ({
      key: year,
      label: year,
      onClick: () => handleYearChange(year),
    })),
  };

  return (
    <FiltroContainer isCollapsed={isCollapsed}>
      <IconWrapper onClick={toggleCollapse}>
        <FaFilter size={18} color="#C4C4C4" />
      </IconWrapper>
      <Column isCollapsed={isCollapsed}>
        <Label>Tiempo</Label>
        <Dropdown menu={yearMenu} trigger={["click"]}>
          <YearButton>
            {filters.year} <DownOutlined style={{ fontSize: "10px" }} />
          </YearButton>
        </Dropdown>
        <StyledRangePicker
          format="DD/MM/YYYY"
          value={
            filters.fechaInicio && filters.fechaFin
              ? [dayjs(filters.fechaInicio), dayjs(filters.fechaFin)]
              : null
          }
          onChange={handleDateRangeChange}
        />
        <Label>Concepto de Pago</Label>
        <StyledAntdInput
          prefix={<FaSearch style={{ color: "#868686" }} />}
          name="concepto"
          value={filters.concepto}
          onChange={(e) => handleChange("concepto", e.target.value)}
          placeholder="Buscar concepto"
        />
        <Label>Beneficiario</Label>
        <InputWrapper>
          <Select
            mode="multiple"
            value={filters.beneficiario}
            onChange={(value: string[]) => handleChange("beneficiario", value || [])}
            placeholder="Seleccione beneficiarios"
            allowClear
            style={{ width: "100%" }}
          >
            {beneficiarios.map((beneficiario) => (
              <Select.Option key={beneficiario} value={beneficiario}>
                {beneficiario}
              </Select.Option>
            ))}
          </Select>
        </InputWrapper>
      </Column>
    </FiltroContainer>
  );
};

export default FiltroPagos;