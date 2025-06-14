import RestaurantFormEditor from "./RestaurantFormEditor";
import RestaurantFormItem from "./RestaurantFormItem";

function RestaurantFormOverallViewContent({
  name,
  description,
  tableTypes,
  tables,
  address,
  phone_number,
  operatingHours,
  onClick,
}) {
  return (
    <div className="w-full h-full mt-10 overflow-true">
      <RestaurantFormEditor
        label="Basic Information"
        handleClick={() => onClick("basicInfo")}
      />
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem item={name} name="Name" checkState="" />
        <RestaurantFormItem
          item={description}
          name="Description"
          checkState=""
        />
        <RestaurantFormItem item={address} name="Address" checkState="" />
        <RestaurantFormItem
          item={phone_number}
          name="Phone Number"
          checkState=""
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
          name="Timeslots"
          checkState={[]}
        />
      </div>
    </div>
  );
}

export default RestaurantFormOverallViewContent;
