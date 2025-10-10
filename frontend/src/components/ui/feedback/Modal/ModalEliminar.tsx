import React from "react";
import { ModalBackground, ModalContent, ModalIcon, ModalActions, CancelButton, DeleteButton } from "./ModalEliminar.styled";

interface ModalEliminarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje: string;
  style?: React.CSSProperties;
}

const ModalEliminar: React.FC<ModalEliminarProps> = ({ isOpen, onClose, onConfirm, mensaje, style }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground style={style}>
      <ModalContent>
        <ModalIcon>
          <span>!</span>
        </ModalIcon>
        <h3>{mensaje}</h3>
        <ModalActions>
          <CancelButton onClick={onClose}>CANCELAR</CancelButton>
          <DeleteButton onClick={onConfirm}>SÍ, ELIMINAR</DeleteButton>
        </ModalActions>
      </ModalContent>
    </ModalBackground>
  );
};

export default ModalEliminar;