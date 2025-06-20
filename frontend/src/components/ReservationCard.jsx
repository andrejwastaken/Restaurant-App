import { NavLink } from "react-router-dom";

function ReservationCard({ reservation, onClick }) {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    });
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600"; // Default color for unknown status
    }
  };

  return (
    <NavLink to={`${reservation.id}`}>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-amber-500 cursor-pointer transition-all duration-200 ease-in-out">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            {/* Display reservation status with dynamic color */}
            <p
              className={`font-bold text-lg mb-1 ${getStatusColorClass(
                reservation.status
              )}`}
            >
              Status: {reservation.status}
            </p>
            {/* Display formatted start time */}
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Time:</span>{" "}
              {formatDateTime(reservation.start_time)}
            </p>
            {/* Display client's contact information (email or phone) */}
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Client:</span>{" "}
              {reservation.client_user.email ||
                reservation.client_user.phone_number}
            </p>
            {/* Display table name */}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Table:</span>{" "}
              {reservation.table.name}
            </p>
          </div>
          {/* Arrow icon for visual indication of clickable item */}
          <div className="text-right flex-shrink-0 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
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
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ReservationCard;
