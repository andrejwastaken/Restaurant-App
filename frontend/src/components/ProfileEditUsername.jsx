import { useState } from "react";

function ProfileEditUsername({ initialData, onSubmit }) {
  const [username, setUsername] = useState(initialData?.username || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username });
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit}>
      <div className="w-full">
        <div className="space-y-2">
          <label
            htmlFor="username-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            autoFocus
          />
        </div>
      </div>
    </form>
  );
}

export default ProfileEditUsername;
