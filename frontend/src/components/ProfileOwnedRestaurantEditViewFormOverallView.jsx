import { useProfileData } from "../contexts/ProfileDataContext";
import RestaurantFormOverallViewContent from "./RestaurantFormOverallViewContent";

function ProfileOwnedRestaurantEditViewFormOverallView({
  basicInformation,
  tablesInformation,
  operatingHours,
  onClick,
  onSave,
}) {
  const { currentOwnedRestaurant } = useProfileData();

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <RestaurantFormOverallViewContent
          name={basicInformation.name}
          description={basicInformation.description}
          address={basicInformation.address}
          phone_number={basicInformation.phone_number}
          default_reservation_slot_duration={
            basicInformation.default_reservation_slot_duration
          }
          tables={tablesInformation}
          operatingHours={operatingHours}
          onClick={onClick}
        />
      </div>
      <button
        onClick={() => onSave(currentOwnedRestaurant)}
        form="modal-form"
        className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
      >
        Submit
      </button>
    </div>
  );
}

export default ProfileOwnedRestaurantEditViewFormOverallView;
