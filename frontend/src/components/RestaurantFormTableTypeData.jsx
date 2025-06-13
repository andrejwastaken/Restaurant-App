function RestaurantFormTableTypeData({ index, name, capacity, onRemove }) {
  return (
    <li
      key={index}
      className="flex flex-col justify-between border-2 border-gray-200 rounded-lg shadow-sm p-4 bg-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-bold text-gray-800">{name}</h5>
          <p className="text-sm text-gray-500">
            Capacity: <span className="font-semibold">{capacity}</span>
          </p>
        </div>
      </div>

      <div className="flex mt-4">
        <button
          onClick={() => onRemove(index)}
          className="w-full text-sm text-white bg-red-500 hover:bg-red-600 font-semibold px-3 py-2 rounded-md transition"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default RestaurantFormTableTypeData;
