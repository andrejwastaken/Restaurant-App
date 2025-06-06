import { useState } from "react";

function ProfileEditPhoneNumber({ initialData, onSubmit }) {
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phone_number || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ phoneNumber });
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit}>
      <div className="w-full">
        <div className="space-y-2">
          <label
            htmlFor="username-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            autoFocus
          />
        </div>
      </div>
    </form>
  );
}

export default ProfileEditPhoneNumber;
