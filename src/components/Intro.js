import React from "react";
import { getDataOld, getImagen } from "../fetchFunctions";

class Intro extends React.Component {
  state: {
    loader: true,
  };

  componentDidMount() {}

  //Prendo el loader antes de que cargue el componente
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
    };
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <div className="content">
            {this.state && this.state.loader && (
              <div className={"loader-wrapper"}>
                <p>
                  <img
                    className="loader"
                    src="/images/loader.svg"
                    alt="loader"
                  />
                </p>
                <p className={"centrado negrita"}>Cargando tus fotos. </p>
                <p className={"centrado negrita"}>Sólo un segundito.</p>
              </div>
            )}
            {this.state && !this.state.loader && (
              <div className={"intro-wrapper"}>
                <p className={"centrado negrita"}>Bienvenido.</p>
                <p className={"centrado negrita"}>
                  Por favor ingresa tu álbum en la barra de la URL de la
                  siguiente manera:
                </p>
                <p className={"centrado negrita margen-bottom"}>
                  fotos.federicodonner.com/NOMBRE_DE_TU_ALBUM
                </p>

                <p className={"centrado negrita"}>
                  Si estás en un dispositivo más antíguo, prueba con la
                  siguiente URL:
                </p>
                <p className={"centrado negrita"}>
                  fotos.federicodonner.com/old/NOMBRE_DE_TU_ALBUM
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;
