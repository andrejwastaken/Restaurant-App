import { useState } from "react";

function ProfileEditEmail({ initialData, onSubmit }) {
  const [email, setEmail] = useState(initialData?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email });
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit}>
      <div className="w-full">
        <div className="space-y-2">
          <label
            htmlFor="username-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            autoFocus
          />
        </div>
      </div>
    </form>
  );
}

export default ProfileEditEmail;
