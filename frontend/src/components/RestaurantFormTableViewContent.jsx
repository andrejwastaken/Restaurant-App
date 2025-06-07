import { toast } from "react-hot-toast";

function RestaurantFormTableViewContent({
  tableInfo,
  onAddTable,
  onChangeTables,
}) {
  return (
    <div class="w-full h-full mt-10 space-y-4 overflow-true mb-10">
      <div className="mb-6">
        <button
          className="mb-4 bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300 ease-in-out"
          onClick={onAddTable}
        >
          Add Table Size
        </button>
      </div>

      {tableInfo.map((table, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-4 mb-3 bg-gray-50 p-3 rounded"
        >
          {/* Size Selector */}
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium">Size</label>
            <select
              className="border p-2 rounded"
              value={table.size}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                const updated = [...tableInfo];
                updated[index].size = newSize;

                onChangeTables(updated);
              }}
            >
              {[...Array(8)].map((_, i) => {
                const value = i + 1;
                const isUsed = tableInfo.some(
                  (t) => t.size === value && t.size !== table.size
                );
                return (
                  <option key={value} value={value} disabled={isUsed}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Count Input */}
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium">Count</label>
            <input
              type="number"
              min="1"
              className="border p-2 rounded w-20"
              value={table.count}
              onChange={(e) => {
                const updated = [...tableInfo];
                updated[index].count = parseInt(e.target.value) || 1;
                // Reset smoking count if it exceeds the new total count
                if (updated[index].smoking > updated[index].count) {
                  updated[index].smoking = updated[index].count;
                }
                onChangeTables(updated);
              }}
            />
          </div>

          {/* --- NEW SMOKING TABLES INPUT --- */}
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium">Smoking</label>
            <input
              type="number"
              min="0"
              max={table.count} // The max is dynamically set to the total count
              className="border p-2 rounded w-20"
              value={table.smoking}
              onChange={(e) => {
                const newSmokingCount = parseInt(e.target.value) || 0;
                // Prevent smoking tables from exceeding the total count
                if (newSmokingCount > table.count) {
                  toast.error(
                    "Smoking tables cannot exceed the total count for this size."
                  );
                  return;
                }
                const updated = [...tableInfo];
                updated[index].smoking = newSmokingCount;
                onChangeTables(updated);
              }}
            />
          </div>

          {/* Remove Button */}
          <button
            onClick={() => {
              const updatedTables = tableInfo.filter((_, idx) => idx !== index);
              onChangeTables(updatedTables);
            }}
            className="ml-auto text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-red-500 rounded-md px-3.5 py-2 text-sm transition"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default RestaurantFormTableViewContent;
