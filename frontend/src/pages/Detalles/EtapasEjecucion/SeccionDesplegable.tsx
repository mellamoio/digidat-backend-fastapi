import React, { useState } from "react";
import { SeccionContainer, SeccionHeader, IconoFlecha, SeccionContent, BarraProgreso } from "./index.styled";
import type { SeccionDesplegableProps } from "../../Dashboard/types/seccion_desplegable";

const SeccionDesplegable: React.FC<SeccionDesplegableProps> = ({
  titulo,
  progreso,
  fechaInicio,
  fechaFin,
  children,
  initialOpen = false,
}) => {
  const [abierto, setAbierto] = useState(initialOpen);

  return (
    <SeccionContainer>
      <SeccionHeader onClick={() => setAbierto(!abierto)}>
        <IconoFlecha abierto={abierto}>▶</IconoFlecha>
        {titulo}
        <BarraProgreso>
          <div style={{ width: `${progreso}%`, backgroundColor: "#4CAF50", height: "100%", borderRadius: "5px" }} />
        </BarraProgreso>
        {fechaInicio && fechaFin && <span>{fechaInicio} - {fechaFin}</span>}
      </SeccionHeader>
      {abierto && <SeccionContent>{children}</SeccionContent>}
    </SeccionContainer>
  );
};

export default SeccionDesplegable;