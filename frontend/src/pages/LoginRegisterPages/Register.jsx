import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import PasswordInput from "../../components/PasswordInput";
import api from "../../api/api";

import Loading from "../../components/Loading";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors({});

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords don't match"];
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
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
      const errors = error.response?.data;
      if (errors && typeof errors === "object") {
        setFormErrors((prev) => ({
          ...prev,
          ...errors,
        }));
      } else {
        const message = "Something went wrong. Please try again!";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: null,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-amber-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-amber-600 px-8 py-5">
          <h1 className="text-center text-2xl font-bold text-white">
            Create an account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
                className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
              <p className="mt-2 text-sm text-red-600 font-medium">
                {formErrors.email ? formErrors.email : ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
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
                className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
              <p className="mt-2 text-sm text-red-600 font-medium">
                {formErrors.username ? formErrors.username : ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+389 XX-XXX-XXX"
                required
                className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              />
              <p className="mt-2 text-sm text-red-600 font-medium">
                {formErrors.phone_number ? formErrors.phone_number : ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-red-600 font-medium">
                {formErrors.password ? formErrors.password : ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-red-600 font-medium">
                {formErrors.confirmPassword ? formErrors.confirmPassword : ""}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex justify-center items-center"
            >
              {isLoading ? (
                <Loading>Creating an account...</Loading>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-5">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-amber-600 hover:text-amber-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
