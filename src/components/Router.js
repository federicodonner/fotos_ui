import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./Main";
import Old from "./Old";
import NotFound from "./NotFound";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/:album" component={Main} />
          <Route exact path="/old/:album" component={Old} />

          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
