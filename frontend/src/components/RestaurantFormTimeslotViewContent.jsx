import { useState } from "react";
import { toast } from "react-hot-toast";

function RestaurantFormTimeslotViewContent({
  timeslotInfo,
  onChangeTimeslots,
}) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const handleAddTime = () => {
    if (!selectedHour || !selectedMinute || !selectedDay) return;

    const time = `${selectedHour}:${selectedMinute}`;

    if (timeslotInfo[selectedDay]?.some((slot) => slot.time === time)) {
      toast.error("Timeslot already exists within that day!");
      return;
    }

    const updatedTimeslots = JSON.parse(JSON.stringify(timeslotInfo));

    updatedTimeslots[selectedDay].push({ time, status: "available" });

    updatedTimeslots[selectedDay].sort((a, b) => a.time.localeCompare(b.time));

    onChangeTimeslots(updatedTimeslots);
  };

  const handleRemoveTime = (day, timeToRemove) => {
    const updatedTimeslots = JSON.parse(JSON.stringify(timeslotInfo));
    updatedTimeslots[day] = updatedTimeslots[day].filter(
      (slot) => slot.time !== timeToRemove
    );

    onChangeTimeslots(updatedTimeslots);
  };

  return (
    <div className="w-full h-full mt-10 space-y-4 mb-10">
      {/* --- Controls for adding a new timeslot --- */}
      <div className="flex items-center gap-4 mb-4 p-4 border rounded-lg">
        <select
          className="border p-2 rounded"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {Object.keys(timeslotInfo).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
        >
          {Array.from({ length: 16 }, (_, i) => {
            // 08:00 to 23:00
            const hour = i + 8;
            const padded = hour.toString().padStart(2, "0");
            return (
              <option key={padded} value={padded}>
                {padded}
              </option>
            );
          })}
        </select>
        <span>:</span>
        <select
          className="border p-2 rounded"
          value={selectedMinute}
          onChange={(e) => setSelectedMinute(e.target.value)}
        >
          {["00", "15", "30", "45"].map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTime}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition ml-auto"
        >
          Add
        </button>
      </div>

      {/* --- Display for existing timeslots --- */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">
          Current Timeslots for {selectedDay}:
        </h4>
        <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
          {timeslotInfo[selectedDay]?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {timeslotInfo[selectedDay].map((slot) => (
                <div
                  key={slot.time}
                  className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm"
                >
                  <span>{slot.time}</span>
                  <button
                    onClick={() => handleRemoveTime(selectedDay, slot.time)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No timeslots added for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantFormTimeslotViewContent;
