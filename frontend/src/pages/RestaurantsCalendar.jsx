import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function RestaurantsCalendar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = location;

	const [selectedDate, setSelectedDate] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const restaurantTimeSlot = state?.restaurantTimeSlot || 30;
	const restaurantOperatingHours = useMemo(
		() =>
			state?.restaurantOperatingHours || [
				{ day_of_week: 3, open_time: "09:00:00", close_time: "17:00:00" },
			],
		[state?.restaurantOperatingHours]
	);

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
		const map = {};
		restaurantOperatingHours.forEach((hours) => {
			map[hours.day_of_week] = {
				open: hours.open_time,
				close: hours.close_time,
			};
		});
		return map;
	}, [restaurantOperatingHours]);

	const getDaysInMonth = (month, year) =>
		new Date(year, month + 1, 0).getDate();

	const getFirstDayOfMonth = (month, year) => {
		const firstDay = new Date(year, month, 1).getDay();
		return firstDay === 0 ? 6 : firstDay - 1;
	};

	const isOperatingDay = useCallback(
		(date) => {
			const dayOfWeek = date.getDay();
			const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			return Object.prototype.hasOwnProperty.call(
				operatingHoursMap,
				mondayBasedDay
			);
		},
		[operatingHoursMap]
	);

	const generateTimeSlots = () => {
		if (!selectedDate || !isOperatingDay(selectedDate)) return [];
		const dayOfWeek = selectedDate.getDay();
		const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const hours = operatingHoursMap[mondayBasedDay];
		if (!hours) return [];
		const slots = [];
		const [openHour, openMin] = hours.open.split(":").map(Number);
		const [closeHour, closeMin] = hours.close.split(":").map(Number);
		let currentTime = new Date();
		currentTime.setHours(openHour, openMin, 0, 0);
		const closeTime = new Date();
		closeTime.setHours(closeHour, closeMin, 0, 0);
		while (currentTime < closeTime) {
			slots.push(
				currentTime.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				})
			);
			currentTime.setMinutes(currentTime.getMinutes() + restaurantTimeSlot);
		}
		return slots;
	};

	const timeSlots = useMemo(generateTimeSlots, [
		selectedDate,
		isOperatingDay,
		operatingHoursMap,
		restaurantTimeSlot,
	]);

	const handleMonthChange = (direction) => {
		setIsTransitioning(true);
		setTimeout(() => {
			if (direction === "next") {
				setCurrentMonth((prevMonth) => {
					if (prevMonth === 11) {
						setCurrentYear(currentYear + 1);
						return 0;
					}
					return prevMonth + 1;
				});
			} else {
				setCurrentMonth((prevMonth) => {
					if (prevMonth === 0) {
						setCurrentYear(currentYear - 1);
						return 11;
					}
					return prevMonth - 1;
				});
			}
			setIsTransitioning(false);
		}, 150);
	};

	const handleDateClick = (day) => {
		const date = new Date(currentYear, currentMonth, day);
		if (isOperatingDay(date)) {
			setSelectedDate(date);
			setSelectedTimeSlot(null);
		}
	};

	const renderCalendarDays = () => {
		const daysInMonth = getDaysInMonth(currentMonth, currentYear);
		const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
		const days = [];
		for (let i = 0; i < firstDay; i++) {
			days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
		}
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(currentYear, currentMonth, day);
			const isOperating = isOperatingDay(date);
			const isSelected =
				selectedDate &&
				selectedDate.getDate() === day &&
				selectedDate.getMonth() === currentMonth &&
				selectedDate.getFullYear() === currentYear;
			days.push(
				<button
					key={day}
					onClick={() => handleDateClick(day)}
					disabled={!isOperating}
					className={`w-8 h-8 text-sm rounded-md transition-colors ${
						isSelected
							? "bg-amber-500 text-white"
							: isOperating
							? "bg-green-100 text-green-800 hover:bg-green-200"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
				>
					{day}
				</button>
			);
		}
		return days;
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white">
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
				<div className="bg-gray-50 rounded-lg p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => handleMonthChange("prev")}
								className="p-2 hover:bg-gray-200 rounded-md transition-colors"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<span className="text-lg font-medium min-w-40 text-center">
								{months[currentMonth]} {currentYear}
							</span>
							<button
								onClick={() => handleMonthChange("next")}
								className="p-2 hover:bg-gray-200 rounded-md transition-colors"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-7 gap-2 mb-4">
						{daysOfWeek.map((day) => (
							<div
								key={day}
								className="text-center text-sm font-medium text-gray-600 py-2"
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
						<div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
					</div>

					<div className="mt-4 text-sm text-gray-600">
						<div className="flex items-center space-x-4">
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

				<div className="bg-gray-50 rounded-lg p-6 flex flex-col">
					<div className="flex items-center space-x-2 mb-6">
						<Clock className="w-5 h-5 text-gray-600" />
						<h2 className="text-xl font-semibold text-gray-800">
							Available Time Slots
						</h2>
					</div>

					<div className="flex-grow">
						{selectedDate ? (
							<div>
								<p className="text-gray-600 mb-4">
									{selectedDate.toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>

								{timeSlots.length > 0 ? (
									<div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
										{timeSlots.map((slot, index) => (
											<button
												key={index}
												onClick={() => setSelectedTimeSlot(slot)}
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
											{selectedDate.toLocaleDateString()}
											{selectedTimeSlot
												? ` at ${selectedTimeSlot}`
												: " - Select a time"}
										</p>
									</div>
									<Link
										to="/reservation-details"
										state={{
											selectedDate: selectedDate.toISOString(),
											selectedTimeSlot,
											restaurantOperatingHours,
											restaurantTimeSlot,
										}}
										onClick={(e) => !selectedTimeSlot && e.preventDefault()}
										className={`px-4 py-2 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors transform hover:scale-105 ${
											!selectedTimeSlot
												? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
												: ""
										}`}
									>
										Add Info
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RestaurantsCalendar;
