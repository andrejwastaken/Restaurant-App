function RestaurantFormEditor({ info, handleClick }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
      <h2 className="text-lg font-semibold text-gray-700">{info}</h2>
      <button
        className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
        onClick={handleClick}
      >
        Edit
      </button>
    </div>
  );
}

export default RestaurantFormEditor;
