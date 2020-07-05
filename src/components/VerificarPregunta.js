import React from "react";
import Header from "./Header";
import { getImagen } from "../fetchFunctions";

class VerificarPregunta extends React.Component {
  tate: { mostrarRespuestaProfesor: false };

  // Toggle de mostrar la respuesta del profesor
  mostrarRespuestaProfesor = () => {
    var { mostrarRespuestaProfesor } = this.state;
    this.setState({
      mostrarRespuestaProfesor: !mostrarRespuestaProfesor,
    });
  };

  componentDidMount() {
    this.setState({ mostrarRespuestaProfesor: false });
  }

  render() {
    return (
      <div className={"pregunta-correccion"}>
        <p>
          <span className={"subrayadoNumero"}>
            {this.props.respuesta.orden} -{" "}
          </span>{" "}
          {this.props.respuesta.texto_pregunta.split("\n").map((it, i) => (
            <span className={i != 0 ? "newLine" : ""} key={"x" + i}>
              {it}
            </span>
          ))}
        </p>
        {this.props.respuesta.imagen_pregunta && (
          <img
            className={"imagenpregunta"}
            src={getImagen(this.props.respuesta.imagen_pregunta)}
            alt={"imagen pregunta " + this.props.respuesta.id}
          />
        )}
        <p className={"respuesta-alumno"}>
          {this.props.respuesta.respuesta_alumno &&
            this.props.respuesta.respuesta_alumno.split("\n").map((it, i) => (
              <span className={"renglon"} key={"x" + i}>
                {it}
              </span>
            ))}
          {!this.props.respuesta.respuesta_alumno && (
            <span className={"no-respondida renglon"}>NO RESPONDIDA</span>
          )}
        </p>
        <p>
          Puntaje de la pregunta: {this.props.respuesta.puntaje} -{" "}
          <span className={"subrayado negrita"}>
            nota obtenida: {this.props.respuesta.nota}
          </span>
        </p>
        {this.props.respuesta.comentarios_profesor && (
          <p className={'cursiva'}>Notas del profesor: {this.props.respuesta.comentarios_profesor}</p>
        )}
        {this.props.respuesta.texto_respuesta && (
          <p>
            <span
              className={"link-texto"}
              onClick={this.mostrarRespuestaProfesor}
            >
              {this.state &&
                !this.state.mostrarRespuestaProfesor &&
                this.props.respuesta.texto_respuesta && (
                  <span>Ver respuesta del profesor</span>
                )}
              {this.state && this.state.mostrarRespuestaProfesor && (
                <span>Esconder respuesta del profesor</span>
              )}
            </span>
          </p>
        )}
        {this.state && this.state.mostrarRespuestaProfesor && (
          <p
            key={"respuestaProfesor" + this.props.respuesta.id}
            className={"gris"}
          >
            {this.props.respuesta.texto_respuesta.split("\n").map((it, i) => (
              <span className={"renglon"} key={"x" + i}>
                {it}
              </span>
            ))}
          </p>
        )}
      </div>
    );
  }
}

export default VerificarPregunta;
