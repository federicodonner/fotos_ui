import React from "react";
import Header from "./Header";
import { getData } from "../fetchFunctions";
import { convertDate } from "../dataFunctions";
import VerificarPregunta from "./VerificarPregunta";

class VerificarCorreccion extends React.Component {
  state: {
    loader: { encendido: true, texto: "" },
    examen: {},
    errorCarga: { mostrar: false, texto: "" },
  };

  // Toggle de mostrar la respuesta del profesor
  mostrarRespuestaProfesor = () => {
    var { mostrarIntermedias } = this.state;
    this.setState({
      mostrarIntermedias: !mostrarIntermedias,
    });
  };

  componentDidMount() {
    // Antes de consultar la API enciende el loader
    this.setState({
      loader: {
        encendido: true,
        texto: "Cargando examen. Por favor aguarde.",
      },
      errorCarga: { mostrar: false },
    });

    var hash = this.props.match.params.hash;
    // Verifica si está creada la instancia del examen con el hash
    if (hash) {
      // Si hay un hash va a buscar la información del examen a la API
      getData("verificarcorreccion/" + hash)
        .then((results) => {
          return results.json();
        })
        .then((response) => {
          // Verifica que la API haya respondido correctamente
          if (response.status != "error") {
            // Si la respuesta de la API fue correcta, carga las pregunas del examen en el estado
            this.setState({ examen: response, loader: { encendido: false } });
          } else {
            this.setState({
              loader: { encendido: false },
              errorCarga: { mostrar: true, texto: response.detail },
            });
          }
        })
        .catch((e) => {
          // Entra a este catch sólo si la API no está respondiendo
          this.setState({
            loader: { encendido: false },
            errorCarga: {
              mostrar: true,
              texto:
                "Hubo un error al obtener los datos del servidor. Por favor inténtalo devuelta más tarde. Gracias.",
            },
          });
        });
    } else {
      this.setState({
        loader: { encendido: false },
        errorCarga: {
          mostrar: true,
          texto:
            "Debes especificar un identificador del examen para ver su corrección. Gracias.",
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
                  <img
                    className="loader"
                    src="/images/loader.svg"
                    alt="loader"
                  />
                </p>
                <p className={"centrado negrita"}>{this.state.loader.texto}</p>
              </>
            )}
            {this.state && this.state.errorCarga.mostrar && (
              <p>{this.state.errorCarga.texto}</p>
            )}
            {this.state && this.state.examen && !this.state.loader.encendido && (
              <>
                <p>
                  Aquí encontrarás la corrección de{" "}
                  <span className={"subrayado"}>
                    {this.state.examen.periodo.examen_nombre}
                  </span>{" "}
                  de{" "}
                  <span className={"subrayado"}>
                    {this.state.examen.periodo.materia_nombre}
                  </span>{" "}
                  de la fecha{" "}
                  {convertDate(this.state.examen.periodo.inicio_dttm)} para el
                  alumno{" "}
                  <span className={"subrayado"}>
                    {this.state.examen.alumno.nombre}{" "}
                    {this.state.examen.alumno.apellido}
                  </span>
                  .
                </p>
                <p>
                  Para cada pregunta verás el texto de la pregunta, la respuesta
                  correcta indicada por el profesor (si hay), la respuesta
                  enviada por el alumno durante la evaluación, el puntaje total
                  de la pregunta y el obtenido por la respuesta, además de
                  comentarios que puede haber realizado el profesor durante la
                  corrección.
                </p>
                <p>
                  El puntaje total obtenido fue de{" "}
                  <span className={"subrayado negrita"}>
                    {this.state.examen.puntaje_obtenido_total}
                  </span>{" "}
                  sobre un total posible de{" "}
                  {this.state.examen.puntaje_examen_total} puntos.
                </p>
                <p className={"subrayado"}>Respuestas individuales:</p>
                {this.state.examen.respuestas.map((respuesta) => {
                  return (
                    <VerificarPregunta
                      respuesta={respuesta}
                      key={"respuesta" + respuesta.id}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default VerificarCorreccion;
