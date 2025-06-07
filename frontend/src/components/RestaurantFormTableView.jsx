import { useState } from "react";
import { toast } from "react-hot-toast";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormTableViewContent from "./RestaurantFormTableViewContent";

function RestaurantFormTableView({ tableInformation, onSave, onReturn }) {
  const [currentTableInformation, setCurrentTableInformation] = useState(
    tableInformation || []
  );

  const handleAddTable = () => {
    const existingSizes = new Set(
      currentTableInformation.map((table) => table.size)
    );

    let smallestSize = -1;
    for (let i = 1; i <= 8; i++) {
      if (!existingSizes.has(i)) {
        smallestSize = i;
        break;
      }
    }

    if (smallestSize === -1) {
      toast.error("Table sizes limit has been reached!");
      return;
    }

    const newTable = { size: smallestSize, count: 1, smoking: 0 };
    setCurrentTableInformation((prevData) => [...prevData, newTable]);
  };

  const handleTablesChange = (updatedTables) => {
    setCurrentTableInformation(updatedTables);
  };

  const handleSaveClick = () => {
    onSave({ tableInformation: currentTableInformation });
    onReturn();
  };

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div>
        <ProfileMenuContentTitle label="Table Information" />
        <RestaurantFormTableViewContent
          tableInfo={currentTableInformation}
          onAddTable={handleAddTable}
          onChangeTables={handleTablesChange}
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

export default RestaurantFormTableView;
