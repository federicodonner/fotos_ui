import React from "react";
import { getDataOld } from "../fetchFunctions";

class Old extends React.Component {
  state: {
    loader: true,
  };

  fotoTouch = (event) => {
    this.setState({
      moviendo: true,
      posicionInicial: event.touches[0].clientX,
    });
  };

  fotoSwipe = (event) => {
    if (this.state.moviendo) {
      var posicionInicial = this.state.posicionInicial || null;
      if (event.touches[0].clientX > posicionInicial) {
        this.setState({ moviendo: false, posicionInicial: null });
        this.fotoAnterior();
      } else {
        this.setState({ moviendo: false, posicionInicial: null });
        this.cambiarFoto();
      }
    }
  };

  cargarFotos = (request) => {
    // Si hay un hash va a buscar la información del examen a la API
    var fotos = JSON.parse(request.response).fotos;
    for (let i = fotos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      var auxiliar = fotos[i];
      fotos[i] = fotos[j];
      fotos[j] = auxiliar;
    }
    this.setState({
      loader: false,
      fotos: fotos,
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
    if (fotoActual === this.state.fotos.length - 1) {
      fotoActual = 0;
    } else {
      fotoActual++;
    }
    this.setState({ fotoActual });
  };

  fotoAnterior = () => {
    var fotoActual = this.state.fotoActual;
    if (fotoActual === 0) {
      fotoActual = this.state.fotos.length - 1;
    } else {
      fotoActual--;
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
              <div
                className="foto-old-wrapper"
                onTouchStart={(touchStartEvent) =>
                  this.fotoTouch(touchStartEvent)
                }
                onTouchMove={(touchMoveEvent) => this.fotoSwipe(touchMoveEvent)}
              >
                <img
                  className={"foto-old"}
                  src={this.state.fotos[this.state.fotoActual]}
                  alt="foto"
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
