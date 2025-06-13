import { useState } from "react";

import LabelInputField from "./LabelInputField";

function RestaurantFormTableSetup({
  tableData,
  tableTypes,
  onDataChange,
  onSave,
  onReturn,
}) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    onDataChange(name, type === "number" ? parseFloat(value) || 0 : value);
  };

  const handleShapeChange = (e) => {
    onDataChange("shape", e.target.value);
  };

  if (!tableData) return null;

  return (
    <div className="flex flex-col justify-between h-full w-full border-2 border-gray-300 rounded-md shadow-sm bg-white p-4 transition-opacity duration-300 ease-in-out">
      <div className="flex-grow h-full flex flex-col">
        <h4 className="text-md font-semibold text-gray-800">Add a table</h4>

        <div className="w-full max-h-[330px] mt-10 mb-10 space-y-4 overflow-y-auto">
          <LabelInputField
            label="Table name"
            type="text"
            name="name"
            initialValue={tableData.name}
            onChange={handleChange}
          />

          <div className="w-full">
            <div className="space-y-2">
              <label
                htmlFor="username-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Table shape
              </label>
              <div className="relative">
                <select
                  value={tableData.shape}
                  onChange={handleShapeChange}
                  id="table-shape-select"
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-gray-900 shadow-sm"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                </select>
                {/* This is the custom arrow icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-2">
              <label
                htmlFor="username-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Table type
              </label>
              <div className="relative">
                <select
                  name="table_type"
                  value={tableData.table_type}
                  onChange={handleChange}
                  id="table-shape-select"
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-gray-900 shadow-sm"
                >
                  <option value="">Select a type</option>
                  {tableTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {/* This is the custom arrow icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {tableData.shape === "rectangle" ? (
            <>
              <LabelInputField
                label="Table width"
                type="number"
                name="width"
                initialValue={tableData.width}
                onChange={handleChange}
              />

              <LabelInputField
                label="Table height"
                type="number"
                name="height"
                initialValue={tableData.height}
                onChange={handleChange}
              />
            </>
          ) : (
            <LabelInputField
              label="Table radius"
              type="number"
              name="radius"
              initialValue={tableData.radius}
              onChange={handleChange}
            />
          )}
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
          onClick={onSave}
          className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default RestaurantFormTableSetup;
