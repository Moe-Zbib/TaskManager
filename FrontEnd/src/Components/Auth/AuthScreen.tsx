import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import styled from "styled-components";

const ParentContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 400px;

  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const ToggleButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const AuthScreen: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true);

  const handleToggleAuth = () => {
    setIsRegister((prevState) => !prevState);
  };

  return (
    <ParentContainer>
      <Container>
        <Heading>Authentication Screen</Heading>
        {isRegister ? <Login /> : <Register />}
        <ToggleButton onClick={handleToggleAuth}>
          {isRegister ? "Switch to Register" : "Switch to Login"}
        </ToggleButton>
      </Container>
    </ParentContainer>
  );
};

export default AuthScreen;
