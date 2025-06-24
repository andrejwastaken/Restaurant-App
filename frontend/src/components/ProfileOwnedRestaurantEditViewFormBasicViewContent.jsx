import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurantEditViewFormBasicViewContent({
  name,
  description,
  address,
  phone_number,
  default_reservation_slot_duration,
  onChange,
}) {
  const { openModal } = useProfileData();

  return (
    <div className="max-h-[400px] h-full mt-5 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restaurant Name
        </label>
        <input
          name="name"
          type="text"
          value={name}
          onChange={onChange}
          placeholder="Restaurant Name"
          className="w-full border p-2 mb-4 rounded"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="address-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Restaurant Address
        </label>
        <input
          id="address-input"
          name="address"
          type="text"
          value={address}
          readOnly
          onClick={() => openModal("EDIT_OWNED_ADDRESS_MAP", null)}
          placeholder="(Булевар) Кирилица/Latinica 42"
          className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-colors duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restaurant Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={onChange}
          className="w-full border p-2 mb-4 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restaurant Phone Number
        </label>
        <input
          name="phone_number"
          type="text"
          value={phone_number}
          onChange={onChange}
          placeholder="+38X-XX-XXX-XXX"
          className="w-full border p-2 mb-4 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum reservation timeslot
        </label>
        <input
          name="default_reservation_slot_duration"
          type="number"
          value={default_reservation_slot_duration}
          onChange={onChange}
          placeholder="ex. 60min"
          className="w-full border p-2 mb-4 rounded"
        />
      </div>
    </div>
  );
}

export default ProfileOwnedRestaurantEditViewFormBasicViewContent;
