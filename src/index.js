import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";

import "./css/main.css";
import "./css/slider.css";

render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.querySelector("#main")
);
