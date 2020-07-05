import React from "react";
import Header from "./Header";
import { getExamenDesdeHash } from "../fetchFunctions";
import { convertDate, convertTime } from "../dataFunctions";

class ExamenPortada extends React.Component {
  state: {
    loader: true,
    examen: {},
  };

  navegarASeccion = (seccion, hash) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: seccion,
      state: { hash },
    });
  };

  componentDidMount() {
    // Antes de consultar la API enciende el loader
    this.setState({ loader: true });
    var hash = this.props.match.params.hash;
    // Verifica si está creada la instancia del examen con el hash
    if (hash) {
      // Si hay un hash va a buscar la información del examen a la API
      getExamenDesdeHash(hash)
        .then((results) => {
          return results.json();
        })
        .then((response) => {
          if (response.status == "error") {
            alert(response.detail);
            this.props.history.push({
              pathname: "/instrucciones",
            });
          }

          this.setState({ examen: response });
          this.setState({ loader: false });
        });
    } else {
      // Si no hay un hash navega a las instrucciones
      this.props.history.push({
        pathname: "/instrucciones",
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <div className="content">
            {this.state && this.state.loader && (
              <>
                <p>
                  <img className="loader" src="/images/loader.svg" />
                </p>
                <p className={"centrado negrita"}>
                  Cargando <span className={"albus"}>Albus</span>. Por favor
                  aguarde.
                </p>
              </>
            )}
            {this.state && this.state.examen && !this.state.loader && (
              <>
                <Header />
                <p>
                  Bienvenido a <span className={"albus"}>Albus</span>, la
                  plataforma online de evaluaciones.
                </p>
                <p>El link que utilizaste corresponde a la evaluación:</p>
                <p className={"indent"}>
                  <span className={"subrayado negrita"}>
                    {this.state.examen.materia_nombre} -{" "}
                    {this.state.examen.examen_nombre}
                  </span>
                </p>
                <p className={"indent"}>
                  para el estudiante{" "}
                  <span className={"subrayado negrita"}>
                    {this.state.examen.alumno_nombre+" "+this.state.examen.alumno_apellido}
                  </span>
                </p>
                <p>
                  Si alguno de estos datos no son correctos, por favor ponte en
                  contacto con el profesor para corroborarlos.
                </p>
                <p>
                  En caso de que sean correctos, al presionar el botón
                  “Comenzar” tendrás acceso a la evaluación. Por favor ten en
                  cuenta que sólo podrás ingresar una vez. Cuando comiences la
                  evaluación no cierres el navegador ni refresques la página. Si no ves el botón "Comenzar" por favor lee con cuidado la alerta debajo.
                </p>
                <p>
                  <span className={"subrayado"}>¡Buena suerte!</span>
                </p>
                {!this.state.examen.fechahora_ingreso &&
                  this.state.examen.dentro_periodo && (
                    <div
                      className={"boton derecha"}
                      onClick={this.navegarASeccion(
                        "/tomarexamen",
                        this.state.examen.hash
                      )}
                    >
                      Comenzar
                    </div>
                  )}
                {!this.state.examen.fechahora_ingreso &&
                  !this.state.examen.dentro_periodo &&
                  this.state.examen.fechahora_actual <
                    this.state.examen.inicio_dttm && (
                    <p className={"importante"}>
                      El período de esta evaluación aún no ha comenzado, vuelve
                      a intentarlo el{" "}
                      {convertDate(this.state.examen.inicio_dttm)}, a las{" "}
                      {convertTime(this.state.examen.inicio_dttm)} y podrás
                      ingresar.
                    </p>
                  )}
                {!this.state.examen.fechahora_ingreso &&
                  !this.state.examen.dentro_periodo &&
                  this.state.examen.fin_dttm <
                    this.state.examen.fechahora_actual && (
                    <p className={"importante"}>
                      El período de esta evaluación finalizó el{" "}
                      {convertDate(this.state.examen.inicio_dttm)}, a las{" "}
                      {convertTime(this.state.examen.inicio_dttm)}.
                    </p>
                  )}
                {this.state.examen.fechahora_ingreso && (
                  <p className={"importante"}>
                    ATENCIÓN, ESTA EVALUACIÓN YA FUE COMPLETADA EL{" "}
                    {convertDate(this.state.examen.fechahora_ingreso)}. SI ERES
                    EL ALUMNO INDICADO ARRIBA Y NO LA COMPLETASTE, PONTE EN
                    CONTACTO CON EL PROFESOR.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ExamenPortada;
