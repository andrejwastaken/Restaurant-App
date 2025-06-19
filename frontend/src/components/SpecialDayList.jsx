import SpecialDayCard from "./SpecialDayCard";

function SpecialDayList({
  specialDays,
  currentSpecialDays,
  onViewDay,
  totalPages,
  currentPage,
  onCurrentPage,
  onViewMode,
}) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Fixed Title */}

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto pt-6 pr-1">
        {specialDays.length > 0 ? (
          <div className="space-y-3">
            {currentSpecialDays.map((day) => (
              <SpecialDayCard
                key={day.id}
                specialDay={day}
                onClick={() => onViewDay(day.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <h3 className="text-xl font-semibold text-gray-500">
              No special days added yet.
            </h3>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex-shrink-0 pt-4 mt-auto flex items-center justify-between text-sm">
          <button
            onClick={() => onCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
            className="font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Back
          </button>
          <span className="font-medium text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() =>
              onCurrentPage((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Next
          </button>
        </div>
      )}

      <div className="flex-shrink-0 mt-6 pt-4 border-t">
        <button
          onClick={() => onViewMode("adding")}
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
        >
          + Add a New Special Day
        </button>
      </div>
    </div>
  );
}

export default SpecialDayList;
