import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Routes } from 'react-router-dom'


import PfFace from './pfface'
import PfDoc from './pfdoc'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PfFace />} path="/" />
        <Route element={<PfDoc />} path="/doc" />
      </Routes>
    </Router>
  );
}

render(<App />, document.getElementById('root'));