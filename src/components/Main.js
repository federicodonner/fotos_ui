import React from "react";
import { getData, getImagen } from "../fetchFunctions";
import { Slide } from "react-slideshow-image";

class Main extends React.Component {
  state: {
    loader: true,
  };

  cargarFotos = (album) => {
    // Si hay un hash va a buscar la información del examen a la API
    getData(album)
      .then((results) => {
        return results.json();
      })
      .then((response) => {
        if (response.status == "error") {
          this.setState({ loader: false, errorRequest: true });
        } else {
          this.setState({ loader: false });
          this.setState({ fotos: response.fotos });
        }
      })
      .catch((e) => {
        this.setState({ loader: false, errorRequest: true });
      });
  };

  componentDidMount() {
    // El loader ya está encendido desde el constructor

    // Carga la URL
    let host = window.location.href;
    // Separa el sub-dominio
    let parts = host.split("/");
    // Obtiene el nombre del álbum
    var album = parts[parts.length - 1];

    this.cargarFotos(album);

    // Función que se ejecuta cada 1 hora para refrescar las fotos
    this.interval = setInterval(() => {
      window.location.reload(false);
    }, 1000 * 60 * 60);
  }

  // Función utilizada para el loop de 1 segundo para el timer
  stop() {
    clearInterval(this.interval);
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
              <div className="slide-container">
                <Slide
                  duration={1000 * 60 * 3}
                  transitionDuration={1000}
                  infinite={true}
                  indicators={false}
                  arrows={false}
                  autoplay={true}
                  images={this.state.fotos}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
