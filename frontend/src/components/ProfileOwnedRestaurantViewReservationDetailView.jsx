import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileData } from "../contexts/ProfileDataContext";
import Loading from "./Loading";

function ProfileOwnedRestaurantViewReservationDetailView({
  onDelete,
  onReturn,
}) {
  const { currentOwnedRestaurant, openModal } = useProfileData();
  const { reservationId } = useParams();

  const navigate = useNavigate();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentOwnedRestaurant?.setup?.reservations) {
      const reservation = currentOwnedRestaurant.setup.reservations.find(
        (res) => String(res.id) === reservationId
      );
      setSelectedReservation(reservation || null);
      setIsLoading(false);
    }
  }, [currentOwnedRestaurant, reservationId]);

  if (isLoading) {
    return <Loading>Loading...</Loading>;
  }

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    });
  };

  const formatDuration = (durationString) => {
    const parts = durationString?.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    let formatted = [];
    if (hours > 0) {
      formatted.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      formatted.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    if (formatted.length === 0) {
      return "Less than a minute"; // Or "0 minutes" depending on desired display for very short durations
    }
    return formatted.join(" ");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-1 mt-5">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p
              className={`mt-1 text-lg font-semibold ${
                selectedReservation.status === "CONFIRMED"
                  ? "text-green-600"
                  : selectedReservation.status === "PENDING"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {selectedReservation.status}
            </p>
          </div>

          {/* Start Time */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDateTime(selectedReservation.start_time)}
            </p>
          </div>

          {/* Duration - Changed to use formatDuration */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1 text-md text-gray-800">
              {formatDuration(selectedReservation?.duration)}
            </p>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client</h3>
            <p className="mt-1 text-md text-gray-800">
              Email: {selectedReservation.client_user.email || "N/A"}
            </p>
            <p className="mt-1 text-md text-gray-800">
              Phone: {selectedReservation.client_user.phone_number || "N/A"}
            </p>
          </div>

          {/* Table Details - Table Name is now clickable */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Table</h3>
            <p className="mt-1 text-md text-gray-800">
              Name:{" "}
              <span
                onClick={() => openModal("SHOW_RESERVATION_TABLE_OWNER", null)}
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                {selectedReservation.table.name}
              </span>
            </p>
            <p className="mt-1 text-md text-gray-800">
              Smoking: {selectedReservation.table.is_smoking ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-4 mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          Return
        </button>
        <button
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none transition-colors duration-200"
          onClick={() => {}}
        >
          Decline Reservation
        </button>
      </div>
    </div>
  );
}

export default ProfileOwnedRestaurantViewReservationDetailView;
