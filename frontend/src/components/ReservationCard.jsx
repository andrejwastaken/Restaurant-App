import { NavLink } from "react-router-dom";

function ReservationCard({
  reservation,
  onClick,
  viewType = "client",
  disabled,
}) {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    };
    return date.toLocaleString("en-GB", options);
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
        return "text-gray-600";
    }
  };
  return (
    <NavLink
      to={`${reservation.id}`}
      state={{ reservation }}
      className="block mb-4"
      onClick={onClick}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
    >
      <div className="mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-amber-500 cursor-pointer transition-all duration-200 ease-in-out">
        <div className="flex justify-between items-start">
          <div className="flex-grow space-y-1">
            <p
              className={`font-bold text-lg ${getStatusColorClass(
                reservation.status
              )}`}
            >
              Status: {reservation.status}
            </p>

            {viewType === "client" && reservation.restaurant_name && (
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Restaurant:</span>{" "}
                {reservation.restaurant_name}
              </p>
            )}

            <p className="text-sm text-gray-900">
              <span className="font-semibold">Time:</span>{" "}
              {formatDateTime(reservation.start_time)}
            </p>

            {viewType === "owner" && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Client:</span>{" "}
                {reservation.client_user.email ||
                  reservation.client_user.phone_number}
              </p>
            )}

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Table:</span>{" "}
              {reservation.table.name}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4 pt-1">
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
