import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthScreen from "./Components/Auth/AuthScreen";
import AddTask from "./Components/Home/AddTask";

function App() {
  const isLoggedIn = false;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/AddTask" /> : <Navigate to="/Auth" />
          }
        />
        <Route path="/Auth" element={<AuthScreen />} />
        <Route path="/AddTask" element={<AddTask />} />
      </Routes>
    </Router>
  );
}

export default App;
