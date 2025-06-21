import { useEffect, useState } from "react";
import ReservationCard from "../components/ReservationCard";
import api from "../api/api";
import Loading from "../components/Loading";

function ProfileReservationHistory() {
	const [reservationsData, setReservationsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const RESERVATIONS_PER_PAGE = 3;

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

	const indexOfLastReservation = currentPage * RESERVATIONS_PER_PAGE;
	const indexOfFirstReservation =
		indexOfLastReservation - RESERVATIONS_PER_PAGE;
	const currentReservations = reservationsData.slice(
		indexOfFirstReservation,
		indexOfLastReservation
	);

	const totalPages = Math.ceil(reservationsData.length / RESERVATIONS_PER_PAGE);

	const handleNextPage = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	};

	const handlePrevPage = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	};
	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-8">
					Your Reservations:
				</h1>
				<div className="w-full">
					{isLoading ? (
						<Loading>Loading your reservations...</Loading>
					) : reservationsData.length > 0 ? (
						<div className="flex flex-col justify-between min-h-[480px]">
							<div>
								{currentReservations.map((reservation) => (
									<ReservationCard
										key={reservation.id}
										reservation={reservation}
										viewType="client"
										disabled={reservation.status === "CANCELLED"}
									/>
								))}
							</div>

							{totalPages > 1 && (
								<div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
									<button
										onClick={handlePrevPage}
										disabled={currentPage === 1}
										className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										Previous
									</button>
									<span className="text-sm text-gray-700">
										Page {currentPage} of {totalPages}
									</span>
									<button
										onClick={handleNextPage}
										disabled={currentPage === totalPages}
										className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										Next
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="text-center text-gray-500 py-20">
							You have no reservations.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfileReservationHistory;
