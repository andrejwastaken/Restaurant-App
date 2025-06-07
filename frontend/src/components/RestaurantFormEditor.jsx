function RestaurantFormEditor({ label, handleClick }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
      <p className="text-[12.5px] font-semibold uppercase text-gray-500 tracking-wider mr-2">
        {label}:
      </p>
      <button
        className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 text-sm rounded-md shadow-sm transition"
        onClick={handleClick}
      >
        Edit
      </button>
    </div>
  );
}

export default RestaurantFormEditor;
