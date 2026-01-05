import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const ModalHeader = styled.div`
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

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
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

export const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 40px;
`;

export const PreviewContainer = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  overflow: auto;
`;

export const FileListContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  overflow-x: auto;
`;

export const FileItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  width: 100px;
  height: 120px; /* Aumentado para dar espacio al texto */
  border: ${(props) => (props.isSelected ? "2px solid #722AE9" : "1px solid #e8e8e8")};
  border-radius: 8px; /* Más redondeado como en la imagen */
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden; /* Para que el fondo del texto no se desborde */
`;

export const FileIconContainer = styled.div`
  flex: 1;
  background: #c4c4c4; /* Fondo para la sección del ícono */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FileIcon = styled.div`
  font-size: 32px; /* Aumentado para que coincida con la imagen */
  color: #2d2b2b;
`;

export const FileNameContainer = styled.div`
  background: #f1f1f1; /* Fondo para la sección del texto */
  padding: 4px 8px;
  text-align: center;
`;

export const FileName = styled.p`
  margin: 0;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
`;

export const RemoveButton = styled(FaTimes)`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px; /* Ajustado para que sea más pequeño */
  color: #c4c4c4; /* Color de la X */
  background: #868686; /* Fondo de la X */
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
`;

export const Footer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e8e8e8;
`;