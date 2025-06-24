import { useState, useMemo, useCallback } from "react";
import {
	Star,
	ChevronLeft,
	ChevronRight,
	Clock,
	ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// A robust helper to format a Date object into 'YYYY-MM-DD' string IN UTC.
const formatDateToYYYYMMDD_UTC = (date) => {
	const year = date.getUTCFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const day = date.getUTCDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
};

function ReservationBookingCalendar({
	reservationCalendarData,
	onChangeReservationCalendarData,
	onChangeViewForm,
	onSetInitialDetailsData,
}) {
	const navigate = useNavigate();
	const {
		// This is now a 'YYYY-MM-DD' string or null
		selectedDate,
		selectedTimeSlot,
		restaurantOperatingHours,
		restaurantTimeSlot,
		restaurantSpecialDays,
	} = reservationCalendarData;

	// Use a date object for calendar navigation, but always treat it as UTC
	const [viewDate, setViewDate] = useState(
		() => new Date(new Date().toISOString().split("T")[0] + "T00:00:00.000Z")
	);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const handleClick = () => {
		// Pass the date string directly. No more Date objects between components.
		const newDetailsData = {
			selectedInitialDate: selectedDate, // 'YYYY-MM-DD'
			selectedDay: new Date(`${selectedDate}T00:00:00.000Z`).getUTCDay(), // Pass UTC day for consistency if needed
			selectedTimeSlot: selectedTimeSlot,
			restaurantOperatingHours: restaurantOperatingHours,
			restaurantTimeSlot: restaurantTimeSlot,
			restaurantSpecialDays: restaurantSpecialDays,
		};

		onSetInitialDetailsData(newDetailsData);
		onChangeViewForm("details");
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const operatingHoursMap = useMemo(() => {
		const map = new Map();
		restaurantOperatingHours.forEach((h) =>
			map.set(h.day_of_week, { open: h.open_time, close: h.close_time })
		);
		return map;
	}, [restaurantOperatingHours]);

	const specialDaysMap = useMemo(() => {
		const map = new Map();
		restaurantSpecialDays.forEach((d) =>
			map.set(d.day, {
				open: d.open_time,
				close: d.close_time,
				description: d.description,
			})
		);
		return map;
	}, [restaurantSpecialDays]);

	// This function now parses the date string as UTC to get the correct day of the week.
	const isOperatingDay = useCallback(
		(dateString) => {
			// Takes 'YYYY-MM-DD'
			if (specialDaysMap.has(dateString)) return true;

			const dateObj = new Date(`${dateString}T00:00:00.000Z`); // Treat as UTC
			const dayOfWeek = dateObj.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
			const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to backend's 0=Mon

			return operatingHoursMap.has(mondayBasedDay);
		},
		[operatingHoursMap, specialDaysMap]
	);

	// In ReservationBookingCalendar.jsx

	const timeSlots = useMemo(() => {
		if (!selectedDate || !isOperatingDay(selectedDate)) return [];

		const specialDayInfo = specialDaysMap.get(selectedDate);
		let hours;

		if (specialDayInfo) {
			hours = { open: specialDayInfo.open, close: specialDayInfo.close };
		} else {
			const dateObj = new Date(`${selectedDate}T00:00:00.000Z`);
			const dayOfWeek = dateObj.getUTCDay();
			const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			hours = operatingHoursMap.get(mondayBasedDay);
		}

		if (!hours) return [];

		const slots = [];
		const [openHour, openMin] = hours.open.split(":").map(Number);
		const [closeHour, closeMin] = hours.close.split(":").map(Number);

		let startMinutes = openHour * 60 + openMin;
		let endMinutes = closeHour * 60 + closeMin;

		// FIX: Detect overnight hours and adjust the end time.
		if (endMinutes <= startMinutes) {
			endMinutes += 24 * 60; // Add 24 hours in minutes
		}

		const lastValidStartMinutes = endMinutes - restaurantTimeSlot;

		for (
			let currentMinutes = startMinutes;
			currentMinutes <= lastValidStartMinutes;
			currentMinutes += restaurantTimeSlot
		) {
			// FIX: Use modulo to correctly calculate the hour for times past midnight.
			const hour = Math.floor((currentMinutes % (24 * 60)) / 60);
			const minute = currentMinutes % 60;

			slots.push(
				`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
			);
		}
		return slots;
	}, [
		selectedDate,
		isOperatingDay,
		operatingHoursMap,
		specialDaysMap,
		restaurantTimeSlot,
	]);

	const handleMonthChange = (direction) => {
		setIsTransitioning(true);
		setTimeout(() => {
			setViewDate((prevDate) => {
				const newDate = new Date(
					Date.UTC(prevDate.getUTCFullYear(), prevDate.getUTCMonth(), 1)
				);
				newDate.setUTCMonth(newDate.getUTCMonth() + direction);
				return newDate;
			});
			setIsTransitioning(false);
		}, 150);
	};

	const handleDateClick = (day) => {
		const dateObj = new Date(
			Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), day)
		);
		const dateString = formatDateToYYYYMMDD_UTC(dateObj);

		if (isOperatingDay(dateString)) {
			onChangeReservationCalendarData({
				selectedDate: dateString,
				selectedTimeSlot: null,
			});
		}
	};

	const renderCalendarDays = () => {
		const year = viewDate.getUTCFullYear();
		const month = viewDate.getUTCMonth();

		const firstDayOfMonth =
			(new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const days = [];

		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(<div key={`empty-${i}`} className="w-8 h-8 p-2"></div>);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const dateString = formatDateToYYYYMMDD_UTC(
				new Date(Date.UTC(year, month, day))
			);
			const specialDayInfo = specialDaysMap.get(dateString);
			const isOperating = isOperatingDay(dateString);
			const isSelected = selectedDate === dateString;

			let dayClasses =
				"w-8 h-8 text-sm rounded-md transition-colors flex items-center justify-center ";
			let title = "";

			if (isSelected) {
				dayClasses += "bg-amber-500 text-white";
			} else if (specialDayInfo) {
				dayClasses +=
					"bg-purple-100 text-purple-800 hover:bg-purple-200 font-bold";
				title = specialDayInfo.description;
			} else if (isOperating) {
				dayClasses += "bg-green-100 text-green-800 hover:bg-green-200";
			} else {
				dayClasses += "bg-gray-100 text-gray-400 cursor-not-allowed";
			}

			days.push(
				<button
					key={day}
					onClick={() => handleDateClick(day)}
					disabled={!isOperating}
					className={dayClasses}
					title={title}
				>
					{day}
				</button>
			);
		}
		return days;
	};

	const selectedDateDisplay = useMemo(() => {
		if (!selectedDate) return null;
		const dateObj = new Date(`${selectedDate}T00:00:00.000Z`);
		return dateObj.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC",
		});
	}, [selectedDate]);

	const selectedSpecialDay = selectedDate
		? specialDaysMap.get(selectedDate)
		: null;

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-6xl mt-10 mx-auto p-6 bg-white m-4 rounded-lg shadow-md">
				<div className="flex items-center mb-8">
					<button
						onClick={() => navigate(-1)}
						className="p-2 mr-4 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
						aria-label="Go back"
					>
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-3xl font-bold text-gray-800">
						Restaurant Calendar
					</h1>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-gray-50 rounded-lg p-6 border">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-800">
								Select Date
							</h2>
							<div className="flex items-center space-x-4">
								<button
									onClick={() => handleMonthChange(-1)}
									className="p-2 hover:bg-gray-200 rounded-md transition-colors"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								<span className="text-lg font-medium min-w-[150px] text-center">
									{months[viewDate.getUTCMonth()]} {viewDate.getUTCFullYear()}
								</span>
								<button
									onClick={() => handleMonthChange(1)}
									className="p-2 hover:bg-gray-200 rounded-md transition-colors"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-7 gap-2 mb-4 text-center">
							{daysOfWeek.map((day) => (
								<div
									key={day}
									className="text-sm font-medium text-gray-600 py-2"
								>
									{day}
								</div>
							))}
						</div>

						<div
							className={`transition-opacity duration-150 ${
								isTransitioning ? "opacity-0" : "opacity-100"
							}`}
						>
							<div className="grid grid-cols-7 gap-2 place-items-center">
								{renderCalendarDays()}
							</div>
						</div>

						<div className="mt-4 text-sm text-gray-600">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-purple-100 rounded"></div>
									<span>Special Day</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-green-100 rounded"></div>
									<span>Available</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-gray-100 rounded"></div>
									<span>Closed</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-6 border flex flex-col">
						<div className="flex items-center space-x-2 mb-6">
							<Clock className="w-5 h-5 text-gray-600" />
							<h2 className="text-xl font-semibold text-gray-800">
								Available Time Slots
							</h2>
						</div>

						<div className="flex-grow">
							{selectedDate ? (
								<div>
									<p className="text-gray-600 mb-4 font-semibold">
										{selectedDateDisplay}
									</p>

									{selectedSpecialDay && (
										<div className="p-3 mb-4 bg-purple-100 border-l-4 border-purple-500 rounded-r-md">
											<div className="flex">
												<div className="py-1">
													<Star className="w-5 h-5 text-purple-600 mr-3" />
												</div>
												<div>
													<p className="font-bold text-purple-800">
														Special Event
													</p>
													<p className="text-sm text-purple-700">
														{selectedSpecialDay.description}
													</p>
												</div>
											</div>
										</div>
									)}

									{timeSlots.length > 0 ? (
										<div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
											{timeSlots.map((slot) => (
												<button
													key={slot}
													onClick={() =>
														onChangeReservationCalendarData({
															selectedTimeSlot: slot,
														})
													}
													className={`p-3 rounded-md border text-sm font-medium transition-colors ${
														selectedTimeSlot === slot
															? "bg-amber-500 text-white border-amber-500"
															: "bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
													}`}
												>
													{slot}
												</button>
											))}
										</div>
									) : (
										<p className="text-gray-500 text-center py-8">
											Restaurant is closed on this day
										</p>
									)}
								</div>
							) : (
								<div className="flex items-center justify-center h-full">
									<p className="text-gray-500 text-center">
										Please select a date to view available time slots
									</p>
								</div>
							)}
						</div>

						<div className="mt-6">
							{selectedDate && (
								<div className="p-4 bg-amber-50 rounded-md">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-amber-900 font-semibold">
												Your Selection
											</p>
											<p className="text-amber-800 text-sm">
												{selectedDate}
												{selectedTimeSlot
													? ` at ${selectedTimeSlot}`
													: " - Select a time"}
											</p>
										</div>
										<button
											onClick={handleClick}
											disabled={!selectedTimeSlot}
											className="px-4 py-2 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
										>
											Add Info
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default ReservationBookingCalendar;
