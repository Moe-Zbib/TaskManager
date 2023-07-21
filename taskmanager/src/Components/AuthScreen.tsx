import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import "./auth.css";

interface UserForm {
  username?: string;
  email: string;
  password: string;
}

const AuthScreen: React.FC = () => {
  const [loginForm, setLoginForm] = useState<UserForm>({
    email: "",
    password: "",
  });

  const [registrationForm, setRegistrationForm] = useState<UserForm>({
    username: "",
    email: "",
    password: "",
  });

  const [isLoginView, setIsLoginView] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isRegistration: boolean
  ) => {
    const { name, value } = e.target;
    if (isRegistration) {
      setRegistrationForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setLoginForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const backendBaseUrl = "http://localhost:3001"; // Replace with your backend URL

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = isLoginView ? loginForm : registrationForm;
      const response: AxiosResponse = await axios.post(
        `${backendBaseUrl}/api/auth/${isLoginView ? "login" : "register"}`,
        formData
      );

      if (response.status === 200) {
        console.log("Logged in or registered successfully!");
        console.log(response.data); // Check the response data from the backend
      }
    } catch (error: any) {
      console.error("An error occurred:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Error response data:", axiosError.response.data);
          console.log("Error status code:", axiosError.response.status);
          setErrorMessage(axiosError.response.data.message);
        } else {
          console.error("Error message:", axiosError.message);
          setErrorMessage("An error occurred while processing the request.");
        }
      } else {
        console.error("Non-Axios Error:", error);
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  const toggleView = () => {
    setIsLoginView((prevState) => !prevState);
    setErrorMessage("");
  };

  return (
    <div className="auth-container">
      <h2>{isLoginView ? "Login" : "Sign Up"}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="auth-form" onSubmit={handleFormSubmit}>
        {!isLoginView && (
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={registrationForm.username}
              onChange={(e) => handleInputChange(e, true)}
              className="form-control"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={isLoginView ? loginForm.email : registrationForm.email}
            onChange={(e) => handleInputChange(e, !isLoginView)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={isLoginView ? loginForm.password : registrationForm.password}
            onChange={(e) => handleInputChange(e, !isLoginView)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          {isLoginView ? "Log In" : "Sign Up"}
        </button>
        <button type="button" className="btn-secondary" onClick={toggleView}>
          {isLoginView ? "Sign Up" : "Log In"} Instead
        </button>
      </form>
    </div>
  );
};

export default AuthScreen;
