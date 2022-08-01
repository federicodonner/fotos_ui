import React, { useState, useEffect } from "react";
import { getDataOld } from "./fetchFunctions";
import loaderImg from "./images/loader.svg";

export default function Old() {
  // Guarda las fotos en state
  const [fotos, setFotos] = useState(null);
  const [loader, setLoader] = useState(true);
  const [errorRequest, setErrorRequest] = useState(false);
  const [fotoActual, setFotoActual] = useState(0);
  // Usada para controlar el tiempo de cada foto y para reiniciar
  const [loop, setLoop] = useState(0);

  const NEW_PICTURE_TIMER = 3 * 60 * 1000;
  const PICTURES_PER_REFRESH = 20;

  useEffect(() => {
    // Carga la URL
    let host = window.location.href;
    // Separa el sub-dominio
    let parts = host.split("/");
    // Obtiene el nombre del álbum
    var album = parts[parts.length - 1];

    getDataOld(album, randomizarFotos, () => {
      setLoader(false);
      setErrorRequest(true);
    });
  }, []);

  // Randomiza el orden de las fotos
  function randomizarFotos(fotosRespuesta) {
    let fotosAux = JSON.parse(fotosRespuesta.response).fotos;
    for (let i = fotosAux.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      var auxiliar = fotosAux[i];
      fotosAux[i] = fotosAux[j];
      fotosAux[j] = auxiliar;
    }
    setFotos(fotosAux);
  }

  useEffect(() => {
    if (fotos) {
      setLoader(false);
      // Necesito setear loop en 1 para que empiece a loopear
      setLoop(1);
    }
  }, [fotos]);

  useEffect(() => {
    if (loop > 0) {
      if (loop === PICTURES_PER_REFRESH) {
        window.location.reload(false);
      }
      setTimeout(() => {
        setLoop(loop + 1);
      }, NEW_PICTURE_TIMER);
      setFotoActual((fotoActual + 1) % fotos.length);
    }
  }, [loop, fotos]);

  return (
    <div className="app-view cover">
      <div className="scrollable">
        <div className="content">
          {loader && (
            <div className={"loader-wrapper"}>
              <p>
                <img className="loader" src={loaderImg} alt="loader" />
              </p>
              <p className={"centrado negrita"}>Cargando tus fotos. </p>
              <p className={"centrado negrita"}>Sólo un segundito.</p>
            </div>
          )}
          {errorRequest && (
            <div className={"loader-wrapper"}>
              <p className={"centrado negrita"}>
                Hubo un error al cargar tus fotos.
              </p>
              <p className={"centrado negrita"}>
                Por favor refresca la página.
              </p>
            </div>
          )}
          {!loader && fotos && (
            <div className="foto-old-wrapper">
              <img className={"foto-old"} src={fotos[fotoActual]} alt="foto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
