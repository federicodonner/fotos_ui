import React from "react";
import { getData, getImagen } from "../fetchFunctions";
import { Slide } from "react-slideshow-image";

class Main extends React.Component {
  state: {
    loader: true,
  };

  procesarFotos = () => {
    var fotosOld = this.state.fotosOld;
    var fotos = [];
    fotosOld.forEach((foto) => {
      fotos.push(getImagen("fotosmamama", foto));
    });
    this.setState({ fotos });
  };

  componentDidMount() {
    // Antes de consultar la API enciende el loader
    this.setState({ loader: true });

    // Si hay un hash va a buscar la información del examen a la API
    getData("fotosmamama")
      .then((results) => {
        return results.json();
      })
      .then((response) => {
        if (response.status == "error") {
          alert(response.detail);
        } else {
          this.setState({ loader: false });
          this.setState({ fotosOld: response.fotos }, this.procesarFotos);
        }
      });
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <div className="content">
            {this.state && this.state.loader && (
              <>
                <p>
                  <img
                    className="loader"
                    src="/images/loader.svg"
                    alt="loader"
                  />
                </p>
              </>
            )}
            {this.state && !this.state.loader && this.state.fotos && (
              <div className="slide-container">
                <Slide
                  duration={180000}
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
