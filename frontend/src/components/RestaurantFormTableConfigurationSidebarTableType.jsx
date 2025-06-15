import { useState } from "react";
import { toast } from "react-hot-toast";

import LabelInputField from "./LabelInputField";

function RestaurantFormTableConfigurationSidebarTableType({
  onReturn,
  onSave,
}) {
  const [tableType, setTableType] = useState({
    name: "",
    capacity: 2,
  });

  function handleChange(e) {
    e.preventDefault();

    const { name, value } = e.target;

    if (name === "capacity") {
      if (value < 2 || value > 8) {
        return;
      }
    }

    setTableType((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSave() {
    if (tableType.name.trim().length === 0) {
      toast.error("Information must be filled in order to add a Table type");
      return;
    }

    onSave(tableType);
    onReturn();
  }

  return (
    <div className="flex flex-col justify-between h-full w-full border-2 border-gray-300 rounded-md shadow-sm bg-white p-4 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col h-full min-h-0">
        <h4 className="text-md font-semibold text-gray-800">
          Add a table type
        </h4>

        <div className="flex-1 min-h-0 overflow-y-auto mt-10 mb-10 space-y-4">
          <LabelInputField
            label="Table type name"
            type="text"
            name="name"
            value={tableType.name}
            onChange={handleChange}
          />

          <LabelInputField
            label="Table type capacity"
            type="number"
            name="capacity"
            value={tableType.capacity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onReturn}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Return
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default RestaurantFormTableConfigurationSidebarTableType;
