import React from "react";
import { getDataOld, getImagen } from "../fetchFunctions";

class Old extends React.Component {
  state: {
    loader: true,
  };

  cargarFotos = (request) => {
    // Si hay un hash va a buscar la información del examen a la API
    this.setState({
      loader: false,
      fotos: JSON.parse(request.response).fotos,
      fotoActual: 0,
      errorRequest: false,
    });

    this.newPictureInterval = setInterval(() => {
      this.cambiarFoto();
    }, 3 * 60 * 1000);
  };

  fallaRequest = (request) => {
    this.setState({ loader: false, errorRequest: true });
  };

  cambiarFoto = () => {
    var fotoActual = this.state.fotoActual;
    if (fotoActual == this.state.fotos.length - 1) {
      fotoActual = 0;
    } else {
      fotoActual++;
    }

    this.setState({ fotoActual });
  };

  componentDidMount() {
    // El loader ya está encendido desde el constructor

    // Carga la URL
    let host = window.location.href;
    // Separa el sub-dominio
    let parts = host.split("/");
    // Obtiene el nombre del álbum
    var album = parts[parts.length - 1];

    getDataOld(album, this.cargarFotos, this.fallaRequest);

    // Función que se ejecuta cada 1 hora para refrescar las fotos
    this.interval = setInterval(() => {
      window.location.reload(false);
    }, 60 * 60 * 1000);
  }

  // Función utilizada para el loop de 1 segundo para el timer
  stop() {
    clearInterval(this.interval);
    clearInterval(this.newPictureInterval);
  }

  componentWillUnmount() {
    this.stop();
  }

  //Prendo el loader antes de que cargue el componente
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      errorRequest: false,
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
            {this.state && this.state.errorRequest && (
              <div className={"loader-wrapper"}>
                <p className={"centrado negrita"}>
                  Hubo un error al cargar tus fotos.
                </p>
                <p className={"centrado negrita"}>
                  Por favor refresca la página.
                </p>
              </div>
            )}
            {this.state && !this.state.loader && this.state.fotos && (
              <div className="foto-old-wrapper">
                <img
                  className={"foto-old"}
                  src={this.state.fotos[this.state.fotoActual]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Old;
