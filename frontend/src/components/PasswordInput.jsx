import { useState } from "react";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";

const PasswordInput = ({ name, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative mt-1">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center pb-2"
      >
        <img
          src={showPassword ? eyeOffIcon : eyeIcon}
          alt={showPassword ? "Hide password" : "Show password"}
          className="w-5 h-5 mt-2"
        />
      </button>
    </div>
  );
};

export default PasswordInput;
