import { useState } from "react";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormTimeslotViewContent from "./RestaurantFormTimeslotViewContent";

const initialTimeSlots = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

function RestaurantFormTimeslotView({ timeslotInformation, onSave, onReturn }) {
  const [currentTimeslotInformation, setCurrentTimeslotInformation] = useState(
    timeslotInformation || initialTimeSlots
  );

  const handleTimeslotsChange = (updatedData) => {
    setCurrentTimeslotInformation(updatedData);
  };

  const handleSaveClick = () => {
    onSave({ timeslotInformation: currentTimeslotInformation });
    onReturn();
  };

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div>
        <ProfileMenuContentTitle label="Timeslot Information" />
        <RestaurantFormTimeslotViewContent
          timeslotInfo={currentTimeslotInformation}
          onChangeTimeslots={handleTimeslotsChange}
        />
      </div>

      <div className="flex space-x-4">
        <button
          className="w-full bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          onClick={onReturn}
        >
          Return
        </button>

        <button
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
          onClick={handleSaveClick}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default RestaurantFormTimeslotView;
