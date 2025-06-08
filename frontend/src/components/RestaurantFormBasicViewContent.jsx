function RestaurantFormBasicViewContent({ name, description, address, phone_number, onChange }) {
  return (
    <div className="w-full h-full mt-10 space-y-4 overflow-true">
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
          Restaurant Address
        </label>
        <input
          name="address"
          type="text"
          value={address}
          onChange={onChange}
          placeholder="ul. Primer, br.X/vlez"
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
    </div>
  );
}

export default RestaurantFormBasicViewContent;
