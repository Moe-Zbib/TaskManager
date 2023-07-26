import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthScreen from "./Components/AuthScreen";
import Home from "./Components/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
