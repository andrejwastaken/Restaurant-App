import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Outlet, useParams } from "react-router-dom";

import api from "../api/api";
import ReservationsList from "./ReservationsList";
import ProfileOwnedRestaurantViewReservationDetailView from "./ProfileOwnedRestaurantViewReservationDetailView";
import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurantViewReservations() {
  const { currentOwnedRestaurant } = useProfileData();

  const { restaurantId, reservationId } = useParams();

  const [reservations, setReservations] = useState(
    currentOwnedRestaurant?.setup?.reservations || []
  );

  const [viewMode, setViewMode] = useState("list");
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);

  // Effect to adjust currentPage if the total number of pages changes (e.g., after add/delete)
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [reservations.length, currentPage, totalPages]);

  const handleViewReservation = (reservationId) => {
    setSelectedReservationId(reservationId);
    setViewMode("viewing");
  };

  const handleBackToList = () => {
    setSelectedReservationId(null);
    setViewMode("list");
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleViewMode = (mode) => {
    setViewMode(mode);
  };

  // --- RENDER LOGIC BASED ON VIEWMODE ---
  let content;

  if (reservationId) {
    content = (
      <ProfileOwnedRestaurantViewReservationDetailView
        onDelete={() => {}}
        onReturn={handleBackToList}
      />
    );
  } else {
    // If no reservationId in URL, show list view
    content = (
      <ReservationsList
        reservations={reservations} // Pass full list for pagination calculations
        currentReservations={currentReservations} // Pass sliced list for display
        onViewReservation={handleViewReservation}
        totalPages={totalPages}
        currentPage={currentPage}
        onCurrentPage={handleCurrentPage}
      />
    );
  }

  return <div className="w-full h-full">{content}</div>;
}

export default ProfileOwnedRestaurantViewReservations;
