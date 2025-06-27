import { useState } from "react";

const daysOfWeek = [
	{ name: "Monday", key: 0 },
	{ name: "Tuesday", key: 1 },
	{ name: "Wednesday", key: 2 },
	{ name: "Thursday", key: 3 },
	{ name: "Friday", key: 4 },
	{ name: "Saturday", key: 5 },
	{ name: "Sunday", key: 6 },
];

function RestaurantFormOperatingHoursViewContent({
	operatingHours,
	onChangeOperatingHours,
	scrollHeight,
}) {
	const [enabledDays, setEnabledDays] = useState(() => {
		const initialDays = {};
		daysOfWeek.forEach((day) => {
			initialDays[day.key] = operatingHours.some(
				(h) => h.day_of_week === day.key
			);
		});
		return initialDays;
	});

	const handleDayToggle = (dayKey) => {
		const isEnabled = !enabledDays[dayKey];
		setEnabledDays((prev) => ({ ...prev, [dayKey]: isEnabled }));

		let updatedHours;
		if (isEnabled) {
			if (!operatingHours.some((h) => h.day_of_week === dayKey)) {
				updatedHours = [
					...operatingHours,
					{ day_of_week: dayKey, open_time: "08:00", close_time: "22:00" },
				];
			} else {
				updatedHours = [...operatingHours];
			}
		} else {
			updatedHours = operatingHours.filter((h) => h.day_of_week !== dayKey);
		}
		onChangeOperatingHours(updatedHours);
	};

	const handleTimeChange = (dayKey, timeType, value) => {
		const updatedHours = operatingHours.map((hour) => {
			if (hour.day_of_week === dayKey) {
				return { ...hour, [timeType]: value };
			}
			return hour;
		});
		onChangeOperatingHours(updatedHours);
	};

	const allTimeSlots = Array.from({ length: 48 }, (_, i) => {
		const hour = Math.floor(i / 2)
			.toString()
			.padStart(2, "0");
		const minute = i % 2 === 0 ? "00" : "30";
		return `${hour}:${minute}`;
	});

	const startHour = 8; // 08:00
	const startIndex = startHour * 2; 

	const partAfterStart = allTimeSlots.slice(startIndex); 
	const partBeforeStart = allTimeSlots.slice(0, startIndex);

	const timeOptions = [...partAfterStart, ...partBeforeStart];

	return (
		<div className="w-full flex-1 mt-7 pr-2">
			<div
				className="h-full overflow-y-auto space-y-3 pr-1"
				style={{ maxHeight: `${scrollHeight}px` }}
			>
				{daysOfWeek.map((day) => {
					const dayInfo = operatingHours.find((h) => h.day_of_week === day.key);
					const isOpen = enabledDays[day.key];
					const isOvernight =
						isOpen && dayInfo && dayInfo.close_time < dayInfo.open_time;
					return (
						<div
							key={day.key}
							className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
						>
							<input
								type="checkbox"
								checked={isOpen}
								onChange={() => handleDayToggle(day.key)}
								className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500"
							/>
							<span className="w-24 font-semibold text-gray-700">
								{day.name}
							</span>
							<div
								className={`flex items-center gap-2 transition-opacity duration-300 ${
									isOpen ? "opacity-100" : "opacity-40 pointer-events-none"
								}`}
							>
								<select
									className="border p-2 rounded-md bg-white disabled:bg-gray-200"
									value={dayInfo?.open_time?.slice(0, 5) || "09:00"}
									onChange={(e) =>
										handleTimeChange(day.key, "open_time", e.target.value)
									}
									disabled={!isOpen}
								>
									{timeOptions.map((time) => (
										<option key={`open-${time}`} value={time}>
											{time}
										</option>
									))}
								</select>
								<span>to</span>
								<select
									className="border p-2 rounded-md bg-white disabled:bg-gray-200"
									value={dayInfo?.close_time?.slice(0, 5) || "17:00"}
									onChange={(e) =>
										handleTimeChange(day.key, "close_time", e.target.value)
									}
									disabled={!isOpen}
								>
									{timeOptions.map((time) => (
										<option key={`close-${time}`} value={time}>
											{time}
										</option>
									))}
								</select>
								{isOvernight && (
									<span className="text-sm font-medium text-amber-600">
										(Next Day)
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default RestaurantFormOperatingHoursViewContent;
