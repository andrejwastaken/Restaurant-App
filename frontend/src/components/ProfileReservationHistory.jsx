import { useEffect } from "react";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import api from "../api/api";

function ProfileReservationHistory() {
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('api/reservations/get-reservations/');
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <ProfileMenuContentTitle label="Your reservations:" />
    </div>
  );
}

export default ProfileReservationHistory;
