import { useState } from "react";

import LabelInputField from "./LabelInputField";

function RestaurantFormTableSetup({
  tableData,
  tableTypes,
  onDataChange,
  onDelete,
  onSave,
  onReturn,
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : type === "number"
        ? parseFloat(value) || 0
        : value;

    onDataChange(name, newValue);
  };

  const handleShapeChange = (e) => {
    onDataChange("shape", e.target.value);
  };

  if (!tableData) return null;

  const isNewTable = tableData.id.toString().startsWith("pending-");

  return (
    <div className="flex flex-col justify-between h-full w-full border-2 border-gray-300 rounded-md shadow-sm bg-white p-4 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col h-full min-h-0">
        <h4 className="text-md font-semibold text-gray-800">Add a table</h4>

        <div className="flex-1 min-h-0 overflow-y-auto mt-10 mb-10 space-y-4 ">
          <LabelInputField
            label="Table name"
            type="text"
            name="name"
            value={tableData.name}
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
                value={tableData.width}
                onChange={handleChange}
              />

              <LabelInputField
                label="Table height"
                type="number"
                name="height"
                value={tableData.height}
                onChange={handleChange}
              />
            </>
          ) : (
            <LabelInputField
              label="Table radius"
              type="number"
              name="radius"
              value={tableData.radius}
              onChange={handleChange}
            />
          )}

          <div className="flex items-center space-x-3 pt-2">
            <input
              name="isSmoking"
              type="checkbox"
              checked={tableData.isSmoking}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <label
              htmlFor="isSmoking"
              className="text-sm font-medium text-gray-700"
            >
              Smoking table
            </label>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
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
