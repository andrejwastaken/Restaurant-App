import { useEffect, useState } from "react";
import ReservationCard from "./ReservationCard";
import api from "../api/api";
import Loading from "./Loading";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import ReservationsList from "./ReservationsList";

function ProfileYourReservations() {
  const [reservationsData, setReservationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(reservationsData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservationsData.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("api/reservations/get-reservations/");
        const unsortedReservations = response.data;
        const sortedReservations = [...unsortedReservations].sort(
          (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );
        setReservationsData(sortedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [reservationsData.length, currentPage, totalPages]);

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full p-6 flex flex-col">
      <ProfileMenuContentTitle label="Your reservations" />

      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading>Loading your reservations...</Loading>
        </div>
      ) : reservationsData.length > 0 ? (
        <div className="flex-grow min-h-0 mt-10">
          <ReservationsList
            reservations={reservationsData}
            currentReservations={currentReservations}
            totalPages={totalPages}
            currentPage={currentPage}
            onCurrentPage={handleCurrentPage}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20">
          You have no reservations.
        </div>
      )}
    </div>
  );
}

export default ProfileYourReservations;
