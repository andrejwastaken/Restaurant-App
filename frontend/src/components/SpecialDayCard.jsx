function SpecialDayCard({ specialDay, onClick }) {
  // A simple formatter for the date to make it more readable
  const formattedDate = new Date(specialDay.day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Set timezone to avoid off-by-one day errors
  });

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-amber-500 cursor-pointer transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg text-gray-900">{formattedDate}</p>
          <p className="text-sm text-gray-600 mt-1">{specialDay.description}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-sm font-medium text-green-600">
            Open: {specialDay.open_time.slice(0, 5)}
          </p>
          <p className="text-sm font-medium text-red-600">
            Close: {specialDay.close_time.slice(0, 5)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpecialDayCard;
