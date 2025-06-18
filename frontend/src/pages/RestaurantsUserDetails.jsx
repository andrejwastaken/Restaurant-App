import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	Users,
	Cigarette,
	Clock,
	Calendar,
	Search,
} from "lucide-react";
import api from "../api/api";
import { toast } from "react-hot-toast";

const InfoSection = ({ icon, title, children }) => (
	<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
		<div className="flex items-center mb-4">
			{icon}
			<h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
		</div>
		{children}
	</div>
);

function ReservationDetailsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const restaurantId = parseInt(location.state?.restaurantId);
	const day = parseInt(location.state?.selectedDay);
	const selectedDateISO = location.state?.selectedDate;
	const selectedTimeSlot = location.state?.selectedTimeSlot;
	const restaurantOperatingHours = location.state?.restaurantOperatingHours;
	const defaultSlotDuration = location.state?.restaurantTimeSlot;
	const selectedDate = useMemo(
		() => new Date(selectedDateISO),
		[selectedDateISO]
	);
	const [partySize, setPartySize] = useState("");
	const [isSmoker, setIsSmoker] = useState(false);
	const [duration, setDuration] = useState("");
	const [isFormComplete, setIsFormComplete] = useState(false);

	useEffect(() => {
		if (partySize && duration) {
			setIsFormComplete(true);
		} else {
			setIsFormComplete(false);
		}
	}, [partySize, duration]);

	const durationOptions = useMemo(() => {
		if (!selectedDate || !selectedTimeSlot || !restaurantOperatingHours)
			return [];

		const dayOfWeek = selectedDate.getDay();
		const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

		const operatingHours = restaurantOperatingHours.find(
			(h) => h.day_of_week === mondayBasedDay
		);
		if (!operatingHours) return [];

		const [closeHour, closeMin] = operatingHours.close_time
			.split(":")
			.map(Number);
		const [startHour, startMin] = selectedTimeSlot.split(":").map(Number);

		const startTime = startHour * 60 + startMin;
		const closeTime = closeHour * 60 + closeMin;

		const maxDuration = closeTime - startTime;
		const options = [];

		for (let d = defaultSlotDuration; d <= maxDuration; d += 30) {
			options.push(d);
		}

		return options;
	}, [
		selectedDate,
		selectedTimeSlot,
		restaurantOperatingHours,
		defaultSlotDuration,
	]);

	const handleFindTables = async () => {
		const params = {
			time: selectedTimeSlot,
			party_size: Number(partySize),
			is_smoker: isSmoker,
			duration: Number(duration),
			day: day,
		};

		try {
			const response = await api.get(
				`api/restaurants-availability/${restaurantId}/`,
				{ params }
			);
			console.log(response.data);
			navigate(`/available-tables/${id}`, {
                state: {
                    availableTables: response.data.tables, 
                    unavailableTables: response.data.unavailable, 
                    reservationDetails: params 
                }
            });
		} catch (error) {
			console.error("Finding tables failed", error);
			toast.error("No tables found.");
		}
		console.log({
			date: selectedDate.toLocaleDateString(),
			time: selectedTimeSlot,
			partySize: Number(partySize),
			isSmoker,
			duration: Number(duration),
			restaurantId: location.state.restaurantId,
			day: day
		});
	};

	if (!location.state) {
		return (
			<div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
				<div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Oops! Something is missing.
					</h1>
					<p className="text-gray-700 mb-6">
						This page requires a date and time selection from the calendar.
						Please go back and choose a reservation slot first.
					</p>
					<button
						onClick={() => navigate(-1)}
						className="w-full flex items-center justify-center px-6 py-3 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Go Back to Calendar
					</button>
				</div>
			</div>
		);
	}
	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* --- Header with Back Button --- */}
				<div className="flex items-center mb-6">
					<button
						onClick={() => navigate(-1)}
						className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
						aria-label="Go back"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-2xl font-bold text-gray-800">
						Reservation Details
					</h1>
				</div>

				{/* --- Summary of Selection --- */}
				<div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg mb-8 flex items-center">
					<Calendar className="w-5 h-5 mr-3" />
					<p className="font-semibold">
						Your selected slot:{" "}
						{selectedDate.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}{" "}
						at {selectedTimeSlot}
					</p>
				</div>

				{/* --- Form Sections --- */}
				<div className="space-y-6">
					{/* 1. Party Size */}
					<InfoSection
						icon={<Users className="w-6 h-6 text-amber-600" />}
						title="How many people?"
					>
						<select
							value={partySize}
							onChange={(e) => setPartySize(e.target.value)}
							className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
						>
							<option value="" disabled>
								Select party size...
							</option>
							{[...Array(8).keys()].map((i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1} person{i > 0 ? "s" : ""}
								</option>
							))}
						</select>
					</InfoSection>

					{/* 2. Smoker Preference */}
					<InfoSection
						icon={<Cigarette className="w-6 h-6 text-amber-600" />}
						title="Smoking Preference"
					>
						<label className="flex items-center w-full p-3 bg-gray-50 border border-gray-300 rounded-md cursor-pointer">
							<input
								type="checkbox"
								checked={isSmoker}
								onChange={(e) => setIsSmoker(e.target.checked)}
								className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
							/>
							<span className="ml-3 text-gray-700">
								Request a table in the smoking section
							</span>
						</label>
					</InfoSection>

					{/* 3. Duration */}
					<InfoSection
						icon={<Clock className="w-6 h-6 text-amber-600" />}
						title="How long will you stay?"
					>
						<select
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
							disabled={durationOptions.length === 0}
						>
							<option value="" disabled>
								Select duration...
							</option>
							{durationOptions.map((d) => (
								<option key={d} value={d}>
									{d} minutes
								</option>
							))}
						</select>
					</InfoSection>
				</div>

				{/* --- Action Button --- */}
				<div className="mt-8">
					<button
						onClick={handleFindTables}
						disabled={!isFormComplete}
						className="w-full flex items-center justify-center px-8 py-4 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
					>
						<Search className="w-5 h-5 mr-2" />
						Find Tables
					</button>
				</div>
			</div>
		</div>
	);
}

export default ReservationDetailsPage;
