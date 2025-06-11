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
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div className="flex-shrink-0">
        <ProfileMenuContentTitle label="Operating Hours Information" />
        <div className="mt-10">
          <RestaurantFormOperatingHoursViewContent
            operatingHours={currentOperatingHours}
            onChangeOperatingHours={handleOperatingHoursChange}
          />
        </div>
      </div>

      <div className="flex-shrink-0 pt-6">
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
    </div>
  );
}

export default RestaurantFormOperatingHoursView;
