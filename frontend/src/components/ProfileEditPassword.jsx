import { useState } from "react";
import { toast } from "react-hot-toast";

import PasswordInput from "./PasswordInput";

function ProfileEditPassword({ onSubmit }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.password.trim().length === 0 &&
      formData.confirmPassword.trim().length === 0
    ) {
      return;
    }

    if (formData.password.trim().length === 0) {
      toast.error("Please enter a valid password!");
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      toast.error("Passwords don't match");
      return;
    }

    onSubmit(formData.password);
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit}>
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>

          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>

          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
}

export default ProfileEditPassword;
