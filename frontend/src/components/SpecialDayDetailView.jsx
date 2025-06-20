function SpecialDayDetailView({ selectedDay, onDelete, onReturn }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-6 flex-grow overflow-y-auto p-4 bg-gray-50 rounded-lg">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {new Date(selectedDay.day).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Hours</h3>
            <p className="mt-1 text-md text-gray-800">
              {selectedDay.open_time.slice(0, 5)} –{" "}
              {selectedDay.close_time.slice(0, 5)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-md text-gray-800">
              {selectedDay.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6 pt-4 border-t">
        <button
          className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none transition-colors duration-200"
          onClick={onReturn}
        >
          Return
        </button>
        <button
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none transition-colors duration-200"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default SpecialDayDetailView;
