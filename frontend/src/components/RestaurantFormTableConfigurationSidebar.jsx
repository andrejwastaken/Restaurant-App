import RestaurantFormTableTypeData from "./RestaurantFormTableTypeData";

function RestaurantFormTableConfigurationSidebar({
  tableTypes,
  onAddTableType,
  onRemoveTableType,
}) {
  function handleRemoveTableType(idx) {
    const newData = tableTypes.filter((tableType, index) => idx !== index);

    onRemoveTableType(newData);
  }

  return (
    <div className="flex flex-col justify-between h-full w-full border-2 border-gray-300 rounded-md shadow-sm bg-white p-4 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col h-full min-h-0">
        <h4 className="text-md font-semibold text-gray-800">
          Table Types Configuration
        </h4>
        {tableTypes.length === 0 ? (
          <div className="flex-grow flex justify-center items-center">
            <h4 className="text-md font-semibold text-gray-800">
              Oops... Nothing here.
            </h4>
          </div>
        ) : (
          <ul className="flex-1 min-h-0 overflow-y-auto mt-10 mb-10 space-y-4">
            {tableTypes.map((tableType, index) => (
              <RestaurantFormTableTypeData
                key={index}
                index={index}
                name={tableType.name}
                capacity={tableType.capacity}
                onRemove={handleRemoveTableType}
              />
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={onAddTableType}
        className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        Add
      </button>
    </div>
  );
}

export default RestaurantFormTableConfigurationSidebar;
