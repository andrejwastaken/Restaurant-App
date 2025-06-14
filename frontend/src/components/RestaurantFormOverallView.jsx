import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormOverallViewContent from "./RestaurantFormOverallViewContent";

function RestaurantFormOverallView({
  basicInformation,
  tablesInformation,
  operatingHours,
  onClick,
  onSubmit,
}) {
  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div>
        <ProfileMenuContentTitle label="Add a Restaurant" />

        <RestaurantFormOverallViewContent
          name={basicInformation.name}
          description={basicInformation.description}
          address={basicInformation.address}
          phone_number={basicInformation.phone_number}
          tables={tablesInformation}
          operatingHours={operatingHours}
          onClick={onClick}
        />
      </div>

      <button
        onClick={onSubmit}
        form="modal-form"
        className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
      >
        Submit
      </button>
    </div>
  );
}

export default RestaurantFormOverallView;
