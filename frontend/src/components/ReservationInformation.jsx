const ReservationInformation = ({ reservation }) => {
    const { restaurant, reservationDate, table } = reservation;

    if (!restaurant || !reservationDate || !table) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-red-600">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="mt-4">Reservation details are incomplete.</p>
            </div>
        );
    }
}
export default ReservationInformation;