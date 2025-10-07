import { useState, useEffect } from "react";
import { DatePicker, Dropdown, type MenuProps, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";

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

interface FiltroFechasProps {
  params: {
    year?: string;
    fecha_reembolso?: string;
    fecha_conclusion?: string;
    [key: string]: any;
  };
  setParams: (params: any) => void;
}

const FiltroFechas = ({ params, setParams }: FiltroFechasProps) => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs(`${dayjs().year()}-01-01`),
    dayjs(`${dayjs().year()}-12-31`),
  ]);

  const generateYears = (numYears: number) => {
    const currentYear = dayjs().year();
    return Array.from({ length: numYears }, (_, i) => (currentYear - i).toString());
  };

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    const newDateRange: [Dayjs, Dayjs] = [dayjs(`${year}-01-01`), dayjs(`${year}-12-31`)];
    setDateRange(newDateRange);
    setParams({
      ...params,
      year: year,
      fecha_reembolso: newDateRange[0].format("YYYY-MM-DD"),
      fecha_conclusion: newDateRange[1].format("YYYY-MM-DD"),
    });
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    _dateStrings: [string, string]
  ) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const newYear = dates[0].year();
      setSelectedYear(newYear);
      setParams({
        ...params,
        anio: newYear.toString(),
        fecha_reembolso: dates[0].format("YYYY-MM-DD"),
        fecha_conclusion: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setDateRange([dayjs(`${selectedYear}-01-01`), dayjs(`${selectedYear}-12-31`)]);
      setParams({
        ...params,
        anio: selectedYear.toString(),
        fecha_reembolso: dayjs(`${selectedYear}-01-01`).format("YYYY-MM-DD"),
        fecha_conclusion: dayjs(`${selectedYear}-12-31`).format("YYYY-MM-DD"),
      });
    }
  };

  useEffect(() => {
    setParams({
      ...params,
      anio: selectedYear.toString(),
      fecha_reembolso: dayjs(`${selectedYear}-01-01`).format("YYYY-MM-DD"),
      fecha_conclusion: dayjs(`${selectedYear}-12-31`).format("YYYY-MM-DD"),
    });
  }, []);

  const yearMenu: MenuProps = {
    items: generateYears(7).map((year) => ({
      key: year,
      label: year,
      onClick: () => handleYearChange(year),
    })),
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Dropdown menu={yearMenu} trigger={["click"]}>
        <YearButton>
          {selectedYear} <DownOutlined style={{ fontSize: "10px" }} />
        </YearButton>
      </Dropdown>
      <StyledRangePicker
        format="DD/MM/YYYY"
        value={dateRange}
        onChange={handleDateRangeChange}
      />
    </div>
  );
};

export default FiltroFechas;