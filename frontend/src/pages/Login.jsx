import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PasswordInput from "../components/PasswordInput";
import api from "../api/api";

import Loading from "../components/Loading";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!emailRegex.test(formData.email)) {
      setValidEmail(false);
      return;
    } else {
      setValidEmail(true);
    }

    setIsLoading(true);

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
      const detail = error.response.data.detail + ".";
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-amber-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-amber-600 px-8 py-5">
          <h1 className="text-center text-2xl font-bold text-white">Welcome</h1>
          <p className="mt-1 text-center text-indigo-200">
            Sign in to your account!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  placeholder="your@email.com"
                />
              </div>
              <p className="mt-2 text-sm text-red-600 font-medium">
                {validEmail ? "" : "Invalid email format."}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex justify-center items-center"
            >
              {isLoading ? <Loading>Signing in...</Loading> : "Sign in"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-5">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-amber-600 hover:text-amber-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
