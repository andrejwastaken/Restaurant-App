import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        phone_number: formData.phone_number,
        password: formData.password,
      };

      const res = await api.post("/auth/register/", payload);

      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data || "An error occurred");
    }
  }

  function handleChange(e) {
    e.preventDefault();

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <br />
      <br />

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <br />
      <br />

      <input
        type="tel" // Better for phone numbers
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <br />
      <br />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <br />
      <br />

      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm password"
        required
      />

      <br />
      <br />

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
