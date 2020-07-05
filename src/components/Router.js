import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotFound from "./NotFound";
import ExamenPortada from "./ExamenPortada";
import Instrucciones from "./Instrucciones";
import TomarExamen from "./TomarExamen";
import Confirmacion from "./Confirmacion";
import VerificarCorreccion from "./VerificarCorreccion";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Instrucciones} />
          <Route exact path="/instrucciones" component={Instrucciones} />
          <Route path="/examen/:hash" component={ExamenPortada} />
          <Route path="/examen/" component={Instrucciones} />
          <Route path="/tomarexamen" component={TomarExamen} />
          <Route path="/confirmacion" component={Confirmacion} />
          <Route path="/correccion/:hash" component={VerificarCorreccion} />
          <Route path="/correccion" component={VerificarCorreccion} />
          {/*Legacy support*/}
          <Route path="/verificarcorreccion/:hash" component={VerificarCorreccion} />
          <Route path="/verificarcorreccion" component={VerificarCorreccion} />
          {/*End legacy support*/}
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
