import styled from "styled-components";
import { Input, Select } from "antd";

export const PagosContainer = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
  }
`;

export const FiltroWrapper = styled.div<{ isCollapsed?: boolean }>`
  width: ${(props) => (props.isCollapsed ? "40px" : "200px")};
  flex-shrink: 0;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: ${(props) => (props.isCollapsed ? "40px" : "100%")};
    order: -1;
  }
`;

export const ContentWrapper = styled.div<{ isCollapsed?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  transition: flex 0.3s ease-in-out;
  @media (max-width: 768px) {
    width: 100%;
    flex: 1;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

export const TableWrapper = styled.div<{ isCollapsed?: boolean }>`
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  position: relative;
  transition: flex 0.3s ease-in-out;
`;

export const MontoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const MontosContainer = styled.div<{ isCollapsed?: boolean }>`
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping during transition */
  justify-content: ${(props) => (props.isCollapsed ? "space-between" : "center")};
  align-items: center;
  gap: ${(props) => (props.isCollapsed ? "20px" : "100px")};
  flex: 1;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* Prevent overflow */
  transition: gap 0.3s ease-in-out, justify-content 0.3s ease-in-out;
  @media (max-width: 1200px) {
    gap: ${(props) => (props.isCollapsed ? "20px" : "50px")};
  }
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap; /* Allow wrapping only on mobile */
  }
`;

export const MontoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 150px; /* Ensure minimum width to prevent stacking */
  max-width: 200px; /* Limit max width to avoid overflow */
  @media (max-width: 768px) {
    align-items: center;
    min-width: 120px;
    max-width: none;
    width: auto;
  }
`;

export const Monto = styled.div<{ color?: string }>`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.color || "#333"};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center; /* Center the MontosContainer */
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

export const Tabla = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #c4c4c4;
  overflow-x: auto;

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  th {
    background: #f4f4f4;
  }

  td {
    border-top: 1px solid #ddd;
    border-left: none;
    border-right: none;
  }

  tr:last-child td {
    border-bottom: 1px solid #ddd;
  }
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }
  overflow-x: auto;
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  height: auto;
  min-height: 40px;
`;

export const StyledInput = styled.input`
  width: 100%;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 5px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  background-color: #fff;
`;

export const IconButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 5px;
  color: #868686;
  align-items: center;
`;

export const InputButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #c4c4c4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-top: 10px;
`;

export const DragAndDropArea = styled.div`
  border: 2px dashed #c4c4c4;
  padding: 20px;
  text-align: center;
  color: #555;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  background: transparent;
  color: #722AE9;
  padding: 12px;
  border: 2px dashed #722AE9;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 16px;

  &:hover {
    background: rgba(46, 46, 218, 0.1);
  }

  span {
    margin-left: 8px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  margin-bottom: 16px;
  overflow-x: auto;
  box-sizing: border-box;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const InputField = styled(Input)`
  flex: 1;
  min-width: 120px;
  max-width: none;
  border: 1px solid #d9d9d9;
  color: #333;
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  height: 36px;
  outline: none;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #C4C4C4;
  }

  &:focus {
    border-color: #722AE9;
    box-shadow: 0 0 0 2px rgba(46, 46, 218, 0.1);
  }

  &.concepto-field {
    min-width: 200px;
    flex: 2;
  }

  &[type="date"]::-webkit-datetime-edit-text,
  &[type="date"]::-webkit-datetime-edit-month-field,
  &[type="date"]::-webkit-datetime-edit-day-field,
  &[type="date"]::-webkit-datetime-edit-year-field {
    color: #C4C4C4;
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
`;

export const SelectField = styled(Select)`
  flex: 1;
  min-width: 120px;
  max-width: none;
  border: 1px solid #d9d9d9;
  color: #333;
  padding: 0 24px 0 8px;
  font-size: 14px;
  border-radius: 5px;
  height: 36px;
  line-height: 36px;
  outline: none;
  transition: border-color 0.3s ease;
  appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="%23C4C4C4" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
    no-repeat right 8px center;
  background-size: 16px;

  &[value="0"],
  &[value=""] {
    color: #C4C4C4;
  }

  &:focus {
    border-color: #722AE9;
    box-shadow: 0 0 0 2px rgba(46, 46, 218, 0.1);
  }

  option {
    color: #333;
  }

  option[value="0"],
  option[value=""] {
    color: #C4C4C4;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const ModalContent = styled.div`
  background: white;
  width: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f4f4f4;
  font-weight: bold;
`;

export const CloseButton = styled.button`
  width: 18px;
  height: 18px;
  background: #722AE9;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: white;
    font-size: 8px;
  }
`;

export const ModalBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
`;

export const InputMonto = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  color: #666;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #722AE9;
    box-shadow: 0 0 0 2px rgba(46, 46, 218, 0.1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  gap: 8px;
`;

export const SaveButton = styled.button`
  background: #722AE9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;

export const AddPagoButton = styled.button`
  background: transparent;
  color: #722AE9;
  padding: 0 12px;
  border-radius: 5px;
  height: 36px;
  cursor: pointer;
  border: 1px solid #722AE9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 100px;
`;