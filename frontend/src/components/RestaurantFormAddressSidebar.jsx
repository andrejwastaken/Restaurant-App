import LabelInputField from "./LabelInputField";

function RestaurantFormAddressSidebar({
  currentAddress,
  isGeocoding,
  onGeocode,
  onChangeAddress,
  onSave,
}) {
  return (
    <div className="flex flex-col justify-between h-full w-full border-2 border-gray-300 rounded-md shadow-sm bg-white p-4 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col h-full min-h-0">
        <h4 className="text-md font-semibold text-gray-800">Add an address</h4>

        <div className="flex-1 min-h-0 overflow-y-auto mt-10 mb-10 space-y-4">
          <LabelInputField
            label="Address"
            type="text"
            name="address"
            value={currentAddress.address}
            onChange={onChangeAddress}
          />

          <button
            type="button"
            onClick={onGeocode}
            disabled={isGeocoding}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {isGeocoding ? "Finding..." : "Find Address on Map"}
          </button>
        </div>
      </div>

      <div className="w-full">
        <button
          type="button"
          onClick={onSave}
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default RestaurantFormAddressSidebar;
