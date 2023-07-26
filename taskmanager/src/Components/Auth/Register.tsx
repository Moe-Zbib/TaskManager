import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook to handle navigation

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
        "http://localhost:3001/api/auth/register",
        formData
      );

      console.log("Response from the backend:", response.data);

      // Print session token in the console
      console.log("Session Token:", response.data.sessionToken);

      // Reset the form after successful submission
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      // Redirect to the "home" page after successful registration
      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error registering user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  console.log("Rendered component. Form data:", formData);

  return (
    <Container>
      <Heading>Register</Heading>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default Register;
