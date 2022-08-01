import React from "react";

export default function Intro() {
  return (
    <div className="app-view cover">
      <div className="scrollable">
        <div className="content">
          <div className={"intro-wrapper"}>
            <p className={"centrado negrita"}>Bienvenido.</p>
            <p className={"centrado negrita"}>
              Por favor ingresa tu álbum en la barra de la URL de la siguiente
              manera:
            </p>
            <p className={"centrado negrita margen-bottom"}>
              fotos.federicodonner.com/NOMBRE_DE_TU_ALBUM
            </p>

            <p className={"centrado negrita"}>
              Si estás en un dispositivo más antíguo, prueba con la siguiente
              URL:
            </p>
            <p className={"centrado negrita"}>
              fotos.federicodonner.com/old/NOMBRE_DE_TU_ALBUM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
