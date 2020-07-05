import React from "react";
import Header from "./Header";
import {
  getRespuestasEnLS,
  postRespuestasFinales,
  borrarRespuestasEnLS,
} from "../fetchFunctions";

class Instrucciones extends React.Component {
  state: {
    loader: { encendido: true, texto: "" },
  };

  navigateToSection = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
  };

  componentDidMount() {
    this.setState({
      loader: {
        encendido: true,
        texto: "Cargando Albus. Por favor aguarde.",
      },
    });

    // Verifica que haya respuestas guardadas pendientes de envío
    var respuestasEnLS = getRespuestasEnLS();
    if (respuestasEnLS) {
      // Vuelve a armar el objeto
      respuestasEnLS = JSON.parse(respuestasEnLS);
      // Actualiza el mensaje del loader
      this.setState({
        loader: {
          encendido: true,
          texto: "Intentando enviar respuestas pendientes. Por favor espere.",
        },
      });
      // Si hay respuestas, las intenta enviar
      var data = {
        hash: respuestasEnLS.hash,
        respuestas: respuestasEnLS.respuestas,
      };
      // Envía las respuestas finales.
      // Si el servidor responde con éxito las borra de LS
      postRespuestasFinales(data)
        .then((result) => {
          borrarRespuestasEnLS();
          var dataConfirmacion = { confirmacion: "ok" };

          this.props.history.push({
            pathname: "/confirmacion",
            state: { dataConfirmacion },
          });
        })
        .catch((e) => {
          // Si la API no responde, muestra un mensaje de error y deja las respuestas guardadas
          alert(
            "No se pudo establecer una conexión, sus respuestas siguen guardadas localmente. Intente ingresar nuevamente en unos minutos."
          );
          var dataConfirmacion = { confirmacion: "localhost" };
          this.props.history.push({
            pathname: "/confirmacion",
            state: { dataConfirmacion },
          });
        });
    } else {
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
            {this.state && !this.state.loader.encendido && (
              <>
                <p>
                  Bienvenido a <span className={"albus"}>Albus</span>, la
                  plataforma online de evaluaciones.
                </p>
                <p>
                  Para poder acceder a una evaluación debes recibir el link con
                  el identificador único que te será enviado por tu profesor
                  previo al inicio. Al seguir ese link encontrarás información
                  específica de la misma.
                </p>
                <p>
                  Sólo podrás acceder a una evaluación durante su duración, si
                  tienes el link pero aún no puedes acceder tal vez no haya
                  comenzado todavía.
                </p>
                <p>
                  Por cualquier consulta puedes escribir un correo a
                  federico.donner@gmail.com.
                </p>
                <p>
                  <span className={"subrayado"}>Preguntas frecuentes</span>
                </p>
                <p className={"negrita"}>
                  ¿Por qué no puedo acceder a mi evaluación?
                </p>
                <p>
                  En Albus no utilizamos un login para acceder a las
                  evaluaciones. Cuando se genere una para ti, recibirás un
                  correo de tu profesor con un link único que te permitirá
                  acceder.
                </p>
                <p className={"negrita"}>
                  ¿Cómo sé si recibí un link para una evaluación?
                </p>
                <p>
                  Debería quedar claro en el correo. Lo puedes reconocer porque
                  termina con "examen/" y luego tu identificador único.
                </p>
                <p className={"negrita"}>
                  ¿Debo recordar mi identificador único para futuras
                  evaluaciones?
                </p>
                <p>
                  No, el identificador se genera para cada alumno y para cada
                  evaluación. Es utilizado por Albus para asegurarse de que una
                  evaluación no es respondida varias veces y de que un alumno no
                  puede acceder a la evaluación de otro.
                </p>
                <p className={"negrita"}>
                  ¿Puedo acceder desde aquí a mi evaluación?
                </p>
                <p>No, la única manera es seguir el link que recibiste.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Instrucciones;
