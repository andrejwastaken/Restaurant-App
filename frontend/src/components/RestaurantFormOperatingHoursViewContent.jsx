import { useState } from "react";
import { toast } from "react-hot-toast";

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
  // This internal state will track which days are "enabled" or "open"
  const [enabledDays, setEnabledDays] = useState(() => {
    const initialDays = {};
    daysOfWeek.forEach((day) => {
      initialDays[day.key] = operatingHours.some(
        (h) => h.day_of_week === day.key
      );
    });
    return initialDays;
  });

  // Handler for enabling/disabling a day
  const handleDayToggle = (dayKey) => {
    const isEnabled = !enabledDays[dayKey];
    setEnabledDays((prev) => ({ ...prev, [dayKey]: isEnabled }));

    let updatedHours;
    if (isEnabled) {
      // Add the day with default hours if it doesn't exist
      if (!operatingHours.some((h) => h.day_of_week === dayKey)) {
        updatedHours = [
          ...operatingHours,
          { day_of_week: dayKey, open_time: "09:00", close_time: "17:00" },
        ];
      } else {
        updatedHours = [...operatingHours];
      }
    } else {
      // Remove the day
      updatedHours = operatingHours.filter((h) => h.day_of_week !== dayKey);
    }
    onChangeOperatingHours(updatedHours);
  };

  // Handler for changing open or close times
  const handleTimeChange = (dayKey, timeType, value) => {
    const updatedHours = operatingHours.map((hour) => {
      if (hour.day_of_week === dayKey) {
        return { ...hour, [timeType]: value };
      }
      return hour;
    });

    // Simple validation
    const dayEntry = updatedHours.find((h) => h.day_of_week === dayKey);
    if (dayEntry && dayEntry.open_time >= dayEntry.close_time) {
      toast.error("Closing time must be after opening time.");
    }

    onChangeOperatingHours(updatedHours);
  };

  // Helper to generate time options for select inputs
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  return (
    <div
      className={`w-full max-h-[${scrollHeight}px] overflow-y-auto mt-6 space-y-3 pr-2`}
    >
      {daysOfWeek.map((day) => {
        const dayInfo = operatingHours.find((h) => h.day_of_week === day.key);
        const isOpen = enabledDays[day.key];

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
            <span className="w-24 font-semibold text-gray-700">{day.name}</span>
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
                value={dayInfo?.close_time || "17:00"}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RestaurantFormOperatingHoursViewContent;
