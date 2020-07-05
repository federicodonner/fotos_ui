import React from "react";
import { postRespuestaInterim, getImagen } from "../fetchFunctions";

class InputRespuesta extends React.Component {
  // El estado enviar es un flag que indica que hubo un cambio
  // en el campo y se marca para enviar la respuesta interim
  state: {
    enviar: false,
    respondida: false,
  };

  // Cuando se des-selecciona un campo de respuesta se envía la información
  // para dejar un registro interno
  blurInput = (ev) => {
    // Si el campo está marcado para enviar, lo manda
    if (this.state.enviar) {
      var data = {
        instancia_id: this.props.instanciaId,
        texto_respuesta: this.respuestaRef.current.value,
      };
      postRespuestaInterim(data);
      // Una vez que se envía el campo, lo vuelvo a marcar para no enviar
      this.setState({ enviar: false, respondida: true });
    }
  };

  // Cuando cambia el campo lo marca para enviar onBlur
  // Además, le paso el contenido del input al Componente padre ejecutando el callback
  marcarParaEnviar = (ev) => {
    if (this.respuestaRef.current.value) {
      this.setState({ enviar: true });
      var data = {
        instancia_id: this.props.instanciaId,
        texto_respuesta: this.respuestaRef.current.value,
      };
      this.props.cambioInput(data);
    } else {
      this.setState({ enviar: false, respondida: false });
    }
  };

  respuestaRef = React.createRef();

  componentDidMount() {
    this.setState({ enviar: false });
  }

  render() {
    return (
      <div
        className={
          this.state && !this.state.respondida
            ? "pregunta preguntaNoRespondida"
            : "pregunta preguntaRespondida"
        }
      >
        <p>
          <span
            className={
              this.state && this.state.respondida
                ? "subrayadoNumero respondidaNumero"
                : "subrayadoNumero"
            }
          >
            {this.props.ordenPregunta} -{" "}
            {this.state && this.state.respondida ? "Respondida" : ""}
          </span>
          {this.props.textoPregunta.split("\n").map((it, i) => (
            <span className={i != 0 ? "newLine" : ""} key={"x" + i}>
              {it}
            </span>
          ))}
        </p>
        {this.props.imagenPregunta && (
          <img
            className={"imagenpregunta"}
            src={getImagen(this.props.imagenPregunta)}
            alt={"imagen pregunta " + this.props.instanciaId}
          />
        )}
        <textarea
          className={
            this.state && this.state.respondida
              ? "inputrespuesta inputrespondida"
              : "inputrespuesta"
          }
          rows="10"
          id={"textorespuesta" + this.props.instanciaId}
          instanciarespuesta={this.props.instanciaId}
          onBlur={this.blurInput}
          ref={this.respuestaRef}
          onChange={this.marcarParaEnviar}
        />
      </div>
    );
  }
}

export default InputRespuesta;
