import { useState } from "react";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormBasicViewContent from "./RestaurantFormBasicViewContent";

function RestaurantFormBasicView({ basicInformation, onSave, onReturn }) {
  const [currentBasicInformation, setCurrentBasicInformation] = useState(
    basicInformation
      ? basicInformation
      : {
          name: "",
          description: "",
          address: "",
          phone_number: "",
          default_reservation_slot_duration: "",
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "default_reservation_slot_duration" && value < 0) {
      return;
    }

    setCurrentBasicInformation((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    onSave({ basicInformation: currentBasicInformation });
    onReturn();
  };

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div>
        <ProfileMenuContentTitle label="Basic Information" />
        <RestaurantFormBasicViewContent
          name={currentBasicInformation.name}
          description={currentBasicInformation.description}
          address={currentBasicInformation.address}
          phone_number={currentBasicInformation.phone_number}
          default_reservation_slot_duration={
            currentBasicInformation.default_reservation_slot_duration
          }
          onChange={handleChange}
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

export default RestaurantFormBasicView;
