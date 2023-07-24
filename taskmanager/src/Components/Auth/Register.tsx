import React, { useState } from "react";
import axios from "axios";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Form data before submission:", formData); // Debug: Log form data before submission

      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        formData
      );
      console.log("Response from the backend:", response.data); // Debug: Log response from the backend
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error registering user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  console.log("Rendered component. Form data:", formData); // Debug: Log form data on every render

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
