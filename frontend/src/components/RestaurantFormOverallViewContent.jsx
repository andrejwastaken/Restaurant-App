import RestaurantFormEditor from "./RestaurantFormEditor";
import RestaurantFormItem from "./RestaurantFormItem";

function RestaurantFormOverallViewContent({
  name,
  description,
  tables,
  address,
  phone_number,
  default_reservation_slot_duration,
  operatingHours,
  onClick,
}) {
  const basicInformation = {
    name: name,
    description: description,
    address: address,
    phone_number: phone_number,
    default_reservation_slot_duration: default_reservation_slot_duration,
  };

  return (
    <div className="w-full h-full mt-7 overflow-true">
      <RestaurantFormEditor
        label="Basic Information"
        handleClick={() => onClick("basicInfo")}
      />
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem
          item={basicInformation}
          name="Basic information configuration"
          checkState={{}}
        />
      </div>

      <RestaurantFormEditor
        label="Table Information"
        handleClick={() => onClick("tableInfo")}
      />

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem
          item={tables}
          name="Tables configuration"
          checkState={[]}
        />
      </div>

      <RestaurantFormEditor
        label="Operating Hours Information"
        handleClick={() => onClick("operatingHours")}
      />

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem
          item={operatingHours}
          name="Timeslots configuration"
          checkState={[]}
        />
      </div>
    </div>
  );
}

export default RestaurantFormOverallViewContent;
