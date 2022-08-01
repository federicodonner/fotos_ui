import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./Main";
import Old from "./Old";
import NotFound from "./NotFound";
import Intro from "./Intro";

class Router extends React.Component {
  render() {
    return (
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/:album" element={<Main />} />
        <Route path="/old/:album" element={<Old />} />
        <Route element={<NotFound />} />
      </Routes>
    );
  }
}

export default Router;
