import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileData } from "../contexts/ProfileDataContext";
import Loading from "./Loading";
import api from "../api/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

function ProfileOwnedRestaurantViewReservationDetailView({
  onDelete,
  onReturn,
}) {
  const { currentOwnedRestaurant, openModal } = useProfileData();
  const { reservationId } = useParams();
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { restaurantId } = useParams();
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
      hour12: false,
      timeZone: "UTC", // Ensure consistent timezone handling
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
      return "Less than a minute";
    }
    return formatted.join(" ");
  };
  const handleDecline = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await api.delete(
        `/api/reservations/${restaurantId}/reservations/${reservationId}/cancel/`
      );
      toast.success("Reservation cancelled successfully!");
      navigate(`/user/owned-restaurants`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to cancel reservation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
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
                  : selectedReservation.status === "CANCELLED"
                  ? "text-red-600"
                  : "text-amber-600"
              }`}
            >
              {selectedReservation.status}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDateTime(selectedReservation.start_time)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1 text-md text-gray-800">
              {formatDuration(selectedReservation?.duration)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Client</h3>
            <p className="mt-1 text-md text-gray-800">
              Email: {selectedReservation.client_user.email || "N/A"}
            </p>
            <p className="mt-1 text-md text-gray-800">
              Phone: {selectedReservation.client_user.phone_number || "N/A"}
            </p>
          </div>

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

      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
        <button
          className="flex-1 text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          onClick={() => navigate(-1)}
        >
          Return
        </button>
        <button
          className="flex-1 text-center py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center"
          onClick={handleDecline}
          disabled={isCancelling || selectedReservation.status === "CANCELLED"}
        >
          {isCancelling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Decline Reservation"
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileOwnedRestaurantViewReservationDetailView;
