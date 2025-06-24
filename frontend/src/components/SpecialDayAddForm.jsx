import { useState } from "react";
import LabelInputField from "./LabelInputField";
import { Handler } from "leaflet";
import toast from "react-hot-toast";

function SpecialDayAddForm({
  specialDay,
  onChangeNewSpecialDay,
  onSave,
  onViewMode,
}) {
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full mt-6 flex-grow overflow-y-auto space-y-4 pr-1">
        <LabelInputField
          label="Date"
          type="date"
          value={specialDay.day}
          name="day"
          onChange={onChangeNewSpecialDay}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="open_time"
              className="block text-sm font-medium text-gray-700"
            >
              Opening Time
            </label>
            <select
              name="open_time"
              id="open_time"
              value={specialDay.open_time}
              onChange={onChangeNewSpecialDay}
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {timeOptions.map((time) => (
                <option key={`open-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="close_time"
              className="block text-sm font-medium text-gray-700"
            >
              Closing Time
            </label>
            <select
              name="close_time"
              id="close_time"
              value={specialDay.close_time}
              onChange={onChangeNewSpecialDay}
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {timeOptions.map((time) => (
                <option key={`close-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={specialDay.description}
            onChange={onChangeNewSpecialDay}
            className="w-full border p-2 mb-4 rounded"
          />
        </div>
      </div>

      <div className="flex space-x-4 pt-4 border-t mt-8">
        <button
          className="w-full bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          onClick={() => onViewMode("list")}
        >
          Return
        </button>

        <button
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SpecialDayAddForm;
