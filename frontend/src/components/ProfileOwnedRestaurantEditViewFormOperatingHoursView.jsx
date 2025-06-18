import { useEffect, useState, useRef } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormOperatingHoursViewContent from "./RestaurantFormOperatingHoursViewContent";

function ProfileOwnedRestaurantEditViewFormOperatingHoursView({
  operatingHoursInformation,
  onSave,
  onReturn,
}) {
  const { currentOwnedRestaurant, handleCurrentOwnedRestaurant } =
    useProfileData();

  const savePending = useRef(false);
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
    const newRestaurantOperatingHours = {
      ...currentOwnedRestaurant,
      setup: {
        ...currentOwnedRestaurant.setup,
        operating_hours: currentOperatingHours,
      },
    };

    savePending.current = true;
    handleCurrentOwnedRestaurant(newRestaurantOperatingHours);
    onSave(newRestaurantOperatingHours);
    onReturn(); // this can stay here
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <RestaurantFormOperatingHoursViewContent
        operatingHours={currentOperatingHours}
        onChangeOperatingHours={handleOperatingHoursChange}
        scrollHeight={400}
      />

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

export default ProfileOwnedRestaurantEditViewFormOperatingHoursView;
