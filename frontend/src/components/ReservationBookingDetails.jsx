import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
	ArrowLeft,
	Users,
	Cigarette,
	Clock,
	Calendar,
	Search,
} from "lucide-react";

import api from "../api/api";

const InfoSection = ({ icon, title, children }) => (
	<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
		<div className="flex items-center mb-4">
			{icon}
			<h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
		</div>
		{children}
	</div>
);

const formatDuration = (minutes) => {
	if (minutes < 60) return `${minutes} minutes`;
	const hours = minutes / 60;
	const hourText = hours === 1 ? "hour" : "hours";
	return `${hours} ${hourText}`;
};

function ReservationBookingDetails({
	reservationDetailsInitialData,
	onChangeViewForm,
	onChangeLoading,
	onChangeReservationTablesData,
}) {
	const {
		selectedInitialDate,
		selectedDay,
		selectedTimeSlot,
		restaurantOperatingHours,
		restaurantSpecialDays,
		restaurantTimeSlot,
	} = reservationDetailsInitialData;

	const { restaurantId } = useParams();

	const selectedDateUTC = useMemo(() => {
		if (!selectedInitialDate) return null;
		return new Date(`${selectedInitialDate}T00:00:00.000Z`);
	}, [selectedInitialDate]);

	const [partySize, setPartySize] = useState("");
	const [isSmoker, setIsSmoker] = useState(false);
	const [duration, setDuration] = useState("");
	const [isFormComplete, setIsFormComplete] = useState(false);

	useEffect(() => {
		setIsFormComplete(!!partySize && !!duration);
	}, [partySize, duration]);

	const durationOptions = useMemo(() => {
		if (
			!selectedDateUTC ||
			!selectedTimeSlot ||
			!restaurantOperatingHours ||
			!restaurantSpecialDays
		) {
			return [];
		}

		let hoursInfo = null;

		const specialDay = restaurantSpecialDays.find(
			(d) => d.day === selectedInitialDate
		);

		if (specialDay) {
			hoursInfo = {
				close_time: specialDay.close_time,
				closes_next_day: specialDay.closes_next_day,
			};
		} else {
			const dayOfWeek = selectedDateUTC.getUTCDay();
			const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

			const operatingHours = restaurantOperatingHours.find(
				(h) => h.day_of_week === mondayBasedDay
			);
			if (operatingHours) {
				hoursInfo = {
					close_time: operatingHours.close_time,
					closes_next_day: operatingHours.closes_next_day,
				};
			}
		}

		if (!hoursInfo) return [];

		const [closeHour, closeMin] = hoursInfo.close_time.split(":").map(Number);
		const [startHour, startMin] = selectedTimeSlot.split(":").map(Number);

		const startTimeInMinutes = startHour * 60 + startMin;
		let closeTimeInMinutes = closeHour * 60 + closeMin;

		if (hoursInfo.closes_next_day && closeTimeInMinutes < startTimeInMinutes) {
			closeTimeInMinutes += 24 * 60;
		}

		const maxDuration = closeTimeInMinutes - startTimeInMinutes;

		if (maxDuration <= 0) return [];

		const options = [];
		for (
			let d = restaurantTimeSlot;
			d <= maxDuration;
			d += restaurantTimeSlot
		) {
			options.push(d);
		}
		return options;
	}, [
		selectedInitialDate,
		selectedTimeSlot,
		restaurantOperatingHours,
		restaurantSpecialDays,
		restaurantTimeSlot,
		selectedDateUTC,
	]);

	const handleFindTables = async () => {
		const params = {
			time: selectedTimeSlot,
			party_size: Number(partySize),
			is_smoker: isSmoker,
			duration: Number(duration),
			day: selectedDay,
			date: selectedInitialDate,
		};

		onChangeLoading(true);
		try {
			const response = await api.get(
				`api/restaurants-availability/${restaurantId}/`,
				{ params }
			);
			const combinedTables = [
				...response.data.tables.map((table) => ({ ...table, available: true })),
				...response.data.unavailable.map((table) => ({
					...table,
					available: false,
				})),
			];
			onChangeReservationTablesData({
				tables: combinedTables,
				reservationDetails: params,
			});
			onChangeViewForm("tables");
		} catch (error) {
			const errorMessage =
				error?.response?.data?.error ||
				"An error occurred while fetching tables.";
			console.error("API call failed:", error.response || error);
			toast.error(errorMessage);
		} finally {
			onChangeLoading(false);
		}
	};

	const displayDate = selectedDateUTC
		? selectedDateUTC.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
				timeZone: "UTC",
		  })
		: "";

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex items-center mb-6">
					<button
						onClick={() => onChangeViewForm("calendar")}
						className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
						aria-label="Go back"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-2xl font-bold text-gray-800">
						Reservation Details
					</h1>
				</div>
				<div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg mb-8 flex items-center">
					<Calendar className="w-5 h-5 mr-3" />
					<p className="font-semibold">
						Your selected slot: {displayDate} at {selectedTimeSlot}
					</p>
				</div>
				<div className="space-y-6">
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
							{[...Array(10).keys()].map((i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1} person{i > 0 ? "s" : ""}
								</option>
							))}
						</select>
					</InfoSection>
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
								{durationOptions.length > 0
									? "Select duration..."
									: "No durations available"}
							</option>
							{durationOptions.map((d) => (
								<option key={d} value={d}>
									{formatDuration(d)}
								</option>
							))}
						</select>
					</InfoSection>
				</div>
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

export default ReservationBookingDetails;
