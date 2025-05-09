import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);

    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        phone_number: formData.phone_number,
        password: formData.password,
      };

      await api.post("/auth/register/", payload);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data || "An error occurred");
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
          <h1 className="text-center text-2xl font-bold text-white">Create an account</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 text-center shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 text-center shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+389 7X-XXX-XXX"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 text-center shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 text-center shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 text-center shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating an account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-5">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;