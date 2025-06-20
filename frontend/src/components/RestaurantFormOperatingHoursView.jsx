import { useState } from "react";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormOperatingHoursViewContent from "./RestaurantFormOperatingHoursViewContent";

function RestaurantFormOperatingHoursView({
  operatingHoursInformation,
  onSave,
  onReturn,
}) {
  const [currentOperatingHours, setCurrentOperatingHours] = useState(
    operatingHoursInformation || []
  );

  const handleOperatingHoursChange = (updatedData) => {
    // Sort data for consistency before setting state
    const sortedData = [...updatedData].sort(
      (a, b) => a.day_of_week - b.day_of_week
    );
    setCurrentOperatingHours(sortedData);
  };

  const handleSaveClick = () => {
    onSave({ operatingHoursInformation: currentOperatingHours });
    onReturn();
  };

  return (
    <div className="w-full h-full p-6 flex flex-col">
      <div className="flex-1 flex flex-col">
        <ProfileMenuContentTitle label="Operating Hours Information" />
        <RestaurantFormOperatingHoursViewContent
          operatingHours={currentOperatingHours}
          onChangeOperatingHours={handleOperatingHoursChange}
          scrollHeight={500}
        />
      </div>

      <div className="flex space-x-4 pt-6">
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

export default RestaurantFormOperatingHoursView;
