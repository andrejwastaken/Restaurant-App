import { useState, useEffect } from "react";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormBasicViewContent from "./RestaurantFormBasicViewContent";
import ProfileOwnedRestaurantEditViewFormBasicViewContent from "./ProfileOwnedRestaurantEditViewFormBasicViewContent";
import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurantEditViewFormBasicView({ onSave, onReturn }) {
  const { currentOwnedRestaurant, handleCurrentOwnedRestaurant } =
    useProfileData();
  const [currentBasicInformation, setCurrentBasicInformation] = useState(
    currentOwnedRestaurant
      ? currentOwnedRestaurant
      : {
          name: "",
          description: "",
          address: "",
          phone_number: "",
          default_reservation_slot_duration: "",
          latitude: 0,
          longitude: 0,
        }
  );

  useEffect(
    function () {
      setCurrentBasicInformation({
        ...currentBasicInformation,
        name: currentOwnedRestaurant.name,
        description: currentOwnedRestaurant.description,
        address: currentOwnedRestaurant.address,
        phone_number: currentOwnedRestaurant.phone_number,
        latitude: currentOwnedRestaurant.latitude,
        longitude: currentOwnedRestaurant.longitude,
        default_reservation_slot_duration:
          currentOwnedRestaurant.setup.default_slot_duration,
      });
    },
    [currentOwnedRestaurant]
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
    const newBasicRestaurantInfo = {
      ...currentOwnedRestaurant,
      name: currentBasicInformation.name,
      description: currentBasicInformation.description,
      address: currentBasicInformation.address,
      phone_number: currentBasicInformation.phone_number,
      latitude: currentBasicInformation.latitude,
      longitude: currentBasicInformation.longitude,
      setup: {
        ...currentOwnedRestaurant.setup,
        default_slot_duration:
          currentBasicInformation.default_reservation_slot_duration,
      },
    };
    handleCurrentOwnedRestaurant(newBasicRestaurantInfo);
    onSave(newBasicRestaurantInfo);
    onReturn();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <ProfileOwnedRestaurantEditViewFormBasicViewContent
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

export default ProfileOwnedRestaurantEditViewFormBasicView;
