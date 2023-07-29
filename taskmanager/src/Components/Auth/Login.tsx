import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ErrorMsg = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const AlertMsg = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState(""); // State to hold the error message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        formData
      );
      console.log(response.data);

      // If login is successful, set the token in local storage for tracking user authentication
      localStorage.setItem("token", response.data.token);

      // Redirect to the Home screen after successful login
      window.location.href = "/home";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error logging in:", error.response?.data);
        if (error.response?.status === 429) {
          setErrorMsg("Too many requests, please try again later.");
        } else {
          setErrorMsg("Email or password are incorrect");
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <Container>
      <Heading>Login</Heading>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </Container>
  );
};

export default Login;
