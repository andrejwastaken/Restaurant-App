import ReservationCard from "./ReservationCard";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";

function ReservationsList({
  reservations,
  currentReservations,
  onViewReservation,
  onAddReservation,
  totalPages,
  currentPage,
  onCurrentPage,
  onViewMode,
}) {
  const reservationsArray = Array.isArray(reservations) ? reservations : [];

  const handleNextPage = () => {
    onCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    onCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pt-4 pr-1">
        {reservationsArray.length > 0 ? (
          <div className="space-y-3">
            {currentReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onClick={() => onViewReservation(reservation.id)}
                viewType = "owner"
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <h3 className="text-xl font-semibold text-gray-500">
              No reservations found for this restaurant.
            </h3>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex-shrink-0 pt-4 mt-auto flex items-center justify-between text-sm border-t border-gray-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>
          <span className="font-medium text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ReservationsList;
