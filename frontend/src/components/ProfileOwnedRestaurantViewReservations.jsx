import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function ProfileOwnedRestaurantViewReservations() {
	const { restaurantId } = useParams();
	useEffect(() => {
		const fetchReservations = async () => {
			try {
				const response = await api.get("api/reservations/get-reservations/" + restaurantId);
				console.log(response.data);
			} catch (error) {
				console.error("Error fetching reservations:", error);
			}
		};
		fetchReservations();
	}, []);
	return (
		<div>
			<div>Reservations</div>
		</div>
	);
}

export default ProfileOwnedRestaurantViewReservations;
