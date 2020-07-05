import React from "react";
import Header from "./Header";
import InputRespuesta from "./InputRespuesta";
import {
  getTomarExamen,
  postRespuestasFinales,
  putIndicarExamenUtilizado,
  guardarRespuestasEnLS,
  getImagen,
} from "../fetchFunctions";
import {
  convertDate,
  convertTime,
  calcularTiempoRestante,
} from "../dataFunctions";

class TomarExamen extends React.Component {
  state: {
    loader: { encendido: true, texto: "" },
    examen: {},
    tiempoRestante: {},
    respuestas: [],
  };

  navegarASeccion = (seccion) => (event) => {
    event.preventDefault();
    this.props.history.push({});
  };

  // Callback ejecutado por cada input cuando hay un cambio en su contenido
  // utilizado para registrarlo en el state
  cambioInput = (data) => {
    // guarda la respuesta en el índice correspondiente al id de la pregunta
    var respuestas = this.state.respuestas;
    respuestas[data.instancia_id] = data;
    this.setState({ respuestas });
  };

  // Función invocada al presionar el botón de enviar respuestas
  enviarRespuestasFinales = () => (ev) => {
    ev.preventDefault();

    if (
      window.confirm(
        "¿Seguro que desea enviar sus respuestas? Si presiona OK no podrá volver atrás. Si presiona CANCELAR no se enviará nada aún."
      )
    ) {
      this.enviarRespuestasFinalesEx();
    }
  };

  // Es necesario esta función para poder enviar respuestas finales
  // sin eventos
  enviarRespuestasFinalesEx = () => {
    this.setState({
      loader: {
        encendido: true,
        texto: "Enviando respuestas. Por favor aguarde.",
      },
    });

    // Es necesario pasar el objeto de cada respuesta a string
    // para que sea interpretado por el servidor
    var respuestas = this.state.respuestas;
    var respuestasProcesadas = [];
    respuestas.forEach(function (respuesta, index) {
      respuestasProcesadas.push(JSON.stringify(respuesta));
    });
    var data = {
      hash: this.state.examen.hash,
      respuestas: respuestasProcesadas,
    };
    // Envía las respuestas finales.
    // Si el servidor no responde con éxito las guarda en local storage
    postRespuestasFinales(data)
      .then((result) => {
        var dataConfirmacion = { confirmacion: "ok" };
        this.props.history.push({
          pathname: "/confirmacion",
          state: { dataConfirmacion },
        });
      })
      .catch((e) => {
        // Si la API no responde, guarda las respuestas en local storage esperando
        // guardar en local storage
        guardarRespuestasEnLS(data);
        alert(
          "No se pudo establecer una conexión, sus respuestas fueron guardadas localmente. Intente ingresar nuevamente en unos minutos."
        );
        var dataConfirmacion = { confirmacion: "localhost" };
        this.props.history.push({
          pathname: "/confirmacion",
          state: { dataConfirmacion },
        });
      });
  };

  componentDidMount() {
    // Antes de consultar la API enciende el loader
    this.setState({
      loader: {
        encendido: true,
        texto: "Cargando examen. Por favor aguarde.",
      },
    });

    // Función que se ejecuta una vez por segundo para actualizar
    // el tiempo restante para enviar las respuestas
    this.interval = setInterval(() => {
      var tiempoRestante = calcularTiempoRestante(
        this.state.examen.periodo.fin_dttm
      );

      // Dependiendo de cuánto tiempo queda de tomarexamen
      switch (tiempoRestante.tiempoRestante) {
        case 3600:
          alert("Queda una hora de tiempo para completar la evaluación.");
          break;
        case 900:
          alert("Quedan 15 minutos de tiempo para completar la evaluación.");
          break;
        case 300:
          alert(
            "Quedan 5 minutos de tiempo para completar la evaluación. Al terminarse se enviarán automaticamente las respuestas ya completadas."
          );
          break;
        case 60:
          alert(
            "Queda 1 minuto de tiempo para completar la evaluación. Al terminarse se enviarán automaticamente las respuestas ya completadas."
          );
          break;
        case 0:
          this.enviarRespuestasFinalesEx();
          break;
      }

      this.setState({
        tiempoRestante: calcularTiempoRestante(
          this.state.examen.periodo.fin_dttm
        ),
      });
    }, 1000);

    var hash = this.props.location.state.hash;
    // Verifica si está creada la instancia del examen con el hash
    if (hash) {
      // Si hay un hash va a buscar la información del examen a la API
      getTomarExamen(hash)
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
          // Verifica que el examen no haya sido ingresado anteriormente
          // Si fue sale, si no fue invoca al enpoint
          if (response.fechahora_ingreso) {
            // Si tiene fechahora_ingreso significa que ya usaron el examen
            this.props.history.push({
              pathname: "/instrucciones",
            });
          }
          // Carga las pregunas del examen en el estado
          this.setState({ examen: response });
          this.setState({ respuestas: [] });
          this.setState({ loader: { encendido: false } });

          // Si carga el examen, invoca al endpoint para actualizar la fechahora_ingreso del hash
          var data = { hash: response.hash };
          putIndicarExamenUtilizado(data);

          window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return (ev.returnValue =
              "¿Está seguro que desea salir? No podrá volver a ingresar a la evaluación, sus respuestas no están ingresadas aún.");
          });
        });
    } else {
      // Si no hay un hash navega a las instrucciones
      this.props.history.push({
        pathname: "/instrucciones",
      });
    }
  }

  // Función utilizada para el loop de 1 segundo para el timer
  stop() {
    clearInterval(this.interval);
  }

  componentWillUnmount() {
    this.stop();
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
            {this.state && this.state.examen && !this.state.loader.encendido && (
              <>
                <p className={"importante"}>
                  <span className={"renglon"}>
                    {this.state.examen.materia.nombre} -{" "}
                    {this.state.examen.examen.nombre} -{" "}
                    {this.state.examen.alumno.nombre+" "+this.state.examen.alumno.apellido}
                  </span>
                  Finaliza el {convertDate(this.state.examen.periodo.fin_dttm)}{" "}
                  a las {convertTime(this.state.examen.periodo.fin_dttm)}.
                </p>
                <p>
                  Debajo tienes las preguntas de la evaluación. Hay un campo de texto para cada una. Debajo del todo en la página verás un botón para enviar tus respuestas. No tendrás otra pantalla, verifica tus respuestas antes de presionarlo.
                </p>
                <p>
                  Importante: no refresques la página ni navegues, debes enviar las respuestas antes de dejar esta página. Al finalizar el tiempo de la evaluación, tus respuestas se enviarán automaticamente si no lo hiciste antes.
                </p>

                {this.state.examen.secciones.map((seccion) => {
                  return (
                    <div
                      className={"seccionexamen"}
                      key={"seccion" + seccion.id}
                    >
                      <div className={"seccionexamen"}>
                        <p className={"subrayado"}>{seccion.titulo}</p>
                        {seccion.descripcion && <p>{seccion.descripcion}</p>}
                        {seccion.imagen && (
                          <img
                            className={"imagenpregunta"}
                            src={getImagen(seccion.imagen)}
                            alt={"imagen pregunta " + seccion.titulo}
                          />
                        )}
                      </div>
                      {seccion.preguntas.map((pregunta) => {
                        return (
                          <InputRespuesta
                            instanciaId={pregunta.instancia_id}
                            cambioInput={this.cambioInput}
                            textoPregunta={pregunta.texto_pregunta}
                            imagenPregunta={pregunta.imagen_pregunta}
                            tipoPregunta={pregunta.tipo_pregunta}
                            ordenPregunta={pregunta.orden}
                            key={"pregunta" + pregunta.instancia_id}
                          />
                        );
                      })}
                    </div>
                  );
                })}
                {this.state && this.state.tiempoRestante && (
                  <div
                    className={"boton derecha"}
                    onClick={
                      this.state.tiempoRestante
                        ? this.enviarRespuestasFinales()
                        : null
                    }
                  >
                    {this.state.tiempoRestante.tiempoRestante > 0
                      ? "Enviar respuestas - tiempo restante " +
                        this.state.tiempoRestante.texto
                      : "El tiempo finalizó. Tus respuestas fueron enviadas."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TomarExamen;
