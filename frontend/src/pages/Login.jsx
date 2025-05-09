import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const res = await api.post("/auth/login/", payload);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Invalid login");
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
    <>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <br />
        <br />

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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <br />
      <hr />

      <Link to="/register">Don't have an account yet? Register here!</Link>
    </>
  );
}

export default Login;
