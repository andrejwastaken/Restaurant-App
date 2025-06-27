import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReservationsList from "./ReservationsList";
import ProfileOwnedRestaurantViewReservationDetailView from "./ProfileOwnedRestaurantViewReservationDetailView";
import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurantViewReservations() {
	const { currentOwnedRestaurant } = useProfileData();

	const { reservationId } = useParams();

	const reservations = currentOwnedRestaurant?.setup?.reservations || [];

	const [, setViewMode] = useState("list");
	const [, setSelectedReservationId] = useState(null);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 3;

	const totalPages = Math.ceil(reservations.length / itemsPerPage);
	const startIndex = currentPage * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentReservations = reservations.slice(startIndex, endIndex);

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

	let content;

	if (reservationId) {
		content = (
			<ProfileOwnedRestaurantViewReservationDetailView
				onDelete={() => {}}
				onReturn={handleBackToList}
			/>
		);
	} else {
		content = (
			<ReservationsList
				reservations={reservations}
				currentReservations={currentReservations}
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
