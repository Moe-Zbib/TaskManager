// src/AuthScreen.tsx
import React from "react";
import Register from "./Auth/Register";
import Login from "./Auth/Login";

const AuthScreen: React.FC = () => {
  return (
    <div>
      <h1>Authentication Screen</h1>
      <Register />
      <Login />
    </div>
  );
};

export default AuthScreen;
