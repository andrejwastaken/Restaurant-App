import { useLocation, useNavigate } from "react-router-dom";
import {
	CheckCircle,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Finalizer = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const reservationDetails = location.state;
	console.log(reservationDetails);
	if (!reservationDetails) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-red-600">
				<h1 className="text-2xl font-bold">Error</h1>
				<button
					onClick={() => navigate("/")}
					className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Back to Home
				</button>
			</div>
		);
	}
	const restaurant_id = reservationDetails.restaurant_id
	const reservation_id = reservationDetails.reservation_id;
	const qrCodeValue = "http://localhost:3000/user/owned-restaurants/" +restaurant_id + "/reservations/" + reservation_id;

	// We use a public QR code generation API to avoid needing a library.
	const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
		qrCodeValue
	)}&ecc=H`;

	return (
		<div className="bg-gray-50 min-h-screen">
			<Navbar />
			<div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
					<div className="text-center space-y-2">
						<CheckCircle className="w-16 h-16 mx-auto text-green-500" />
						<h1 className="text-3xl font-bold text-gray-800">
							Reservation Confirmed!
						</h1>
						<p className="text-gray-500">
							Your table is booked. <br /> Present this confirmation upon
							arrival.
						</p>
					</div>

					<hr />

					<div className="flex flex-col items-center justify-center pt-4">
						<p className="text-sm font-semibold text-gray-600 mb-3">
							Scan for Reservation Details.
						</p>
						<div className="p-4 bg-white rounded-lg border">
							<img
								src={qrCodeApiUrl}
								alt="Reservation QR Code"
								width="180"
								height="180"
							/>
						</div>
					</div>

					<button
						onClick={() => navigate("/user/your-reservations")}
						className="w-full mt-6 px-4 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
					>
						View your reservations.
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Finalizer;
