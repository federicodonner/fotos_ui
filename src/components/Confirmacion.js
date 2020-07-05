import React from "react";
import Header from "./Header";

class Confirmacion extends React.Component {
  state: {};

  componentDidMount() {
    this.setState({
      loader: {
        encendido: true,
        texto: "Cargando. Por favor aguarde.",
      },
    });

    // Si se carga esta página sin props navega a home
    if (!this.props.location.state) {
      console.log("me voy" + this.props.location);
      this.props.history.push({
        pathname: "/instrucciones",
      });
    } else {
      // Si hay props, muestra la página correspondiente
      this.setState({
        loader: {
          encendido: false,
        },
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <div className="content">
            <Header />
            {this.state && this.state.loader.encendido && (
              <>
                <p>
                  <img className="loader" src="/images/loader.svg" />
                </p>
                <p className={"centrado negrita"}>{this.state.loader.texto}</p>
              </>
            )}
            {this.state &&
              !this.state.loader.encendido &&
              this.props.location &&
              this.props.location.state &&
              this.props.location.state.dataConfirmacion &&
              this.props.location.state.dataConfirmacion.confirmacion ==
                "ok" && (
                <>
                  <p>
                    Tus respuestas han sido registradas correctamente, puedes
                    cerrar esta ventana. Es posible que tu navegador te pida confirmación al cerrar, no te preocupes que tus respuestas ya quedaron registradas.
                  </p>
                  <p>
                    <span className={"subrayado"}>¡Buena suerte!</span>
                  </p>
                </>
              )}
            {this.state &&
              !this.state.loader.encendido &&
              this.props.location &&
              this.props.location.state &&
              this.props.location.state.dataConfirmacion &&
              this.props.location.state.dataConfirmacion.confirmacion ==
                "localhost" && (
                <>
                  <p>
                    No se pudo establecer una conexión con el servidor, tus
                    respuestas fueron registradas localmente. En unos minutos
                    vuelve a ingresar a <span className={"Albus"}>Albus</span> y
                    se reintantará el envío automáticamente.
                  </p>
                  <p>
                    <span className={"subrayado"}>¡Buena suerte!</span>
                  </p>
                </>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmacion;
