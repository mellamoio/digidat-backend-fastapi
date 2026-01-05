import styled from "styled-components";

export const ModalContainer = styled.div`
  position: relative;
  background: white;
  width: 600px;
  max-width: 90%;
  padding: 50px 20px 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #f0f0f0;
  padding: 8px 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: #722AE9;
  color: white;
  font-size: 10px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  top: 1px;
  border: none;
`;

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
`;

export const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) => (props.primary ? "#722AE9" : "#f0f0f0")};
  color: ${(props) => (props.primary ? "white" : "#4a4a4a")};
  transition: 0.3s;
  border: none;
`;

export const DropZone = styled.div<{ isDragging: boolean }>`
  margin-top: 15px;
  border: 2px dashed #ccc;
  border-radius: 6px;
  text-align: center;
  padding: 30px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  background: ${(props) => (props.isDragging ? "#f0f8ff" : "white")};
  position: relative;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  margin-top: 10px;
`;