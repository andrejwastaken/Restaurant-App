import RestaurantFormEditor from "./RestaurantFormEditor";
import RestaurantFormItem from "./RestaurantFormItem";

function RestaurantFormOverallViewContent({
  name,
  description,
  tableSizes,
  smokingTables,
  timeslots,
  initialTimeSlots,
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
      </div>

      <RestaurantFormEditor
        label="Table Information"
        handleClick={() => onClick("tableInfo")}
      />

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem
          item={tableSizes}
          name="Table sizes"
          checkState={[]}
        />
      </div>

      <RestaurantFormEditor
        label="Timeslot Information"
        handleClick={() => onClick("timeslotInfo")}
      />

      <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-6">
        <RestaurantFormItem
          item={timeslots}
          name="Timeslots"
          checkState={initialTimeSlots}
        />
      </div>
    </div>
  );
}

export default RestaurantFormOverallViewContent;
