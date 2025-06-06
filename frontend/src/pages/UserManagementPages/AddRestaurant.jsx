import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../api/api";
import RestaurantFormEditor from "../../components/RestaurantFormEditor";
import RestaurantFormItem from "../../components/RestaurantFormItem";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// check state for Empty write
const initialTimeSlots = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

function AddRestaurant() {
  let navigate = useNavigate();
  const [formView, setFormView] = useState("overall");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Setting tables (size + num)
  const [selectedSize, setSelectedSize] = useState(2);
  const [tableSizes, setTableSizes] = useState([]);
  const [numTables, setNumTables] = useState(0);
  const [smokingTables, setSmokingTables] = useState(0);

  // Timeslots logic state
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [timeslots, setTimeslots] = useState(initialTimeSlots);

  async function handleSubmit() {
    const timeSlotIsEmpty = Object.values(timeslots).every(
      (day) => day.length === 0
    );
    if (!name || !description || tableSizes.length === 0 || timeSlotIsEmpty) {
      toast.error("All fields must be filled in order to add a restaurant.");
      return;
    }

    try {
      const payload = {
        name: name,
        description: description,
        restaurant_setup: {
          num_tables: numTables,
          num_tables_smoking: smokingTables,
          timeslots_by_day: timeslots,
          tables_by_size: tableSizes,
        },
      };

      await api.post("api/add-restaurant/", payload);
      toast.success("Restaurant added successfully!");
      navigate("/profile");
    } catch (error) {
      const status = error.response.data?.name + "!" || "Unexpected error!";
      toast.error(status);
    }
  }

  useEffect(
    function () {
      const total = tableSizes.reduce((total, table) => total + table.count, 0);
      setNumTables(total);
    },
    [tableSizes]
  );

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        {formView === "overall" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Information Overview</h2>

            <RestaurantFormEditor
              info="Basic Information"
              handleClick={() => setFormView("basicInfo")}
            />

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-5">
              <RestaurantFormItem item={name} name="Name" checkState="" />
              <RestaurantFormItem
                item={description}
                name="Description"
                checkState=""
              />
            </div>

            <RestaurantFormEditor
              info="Table Information"
              handleClick={() => setFormView("tableInfo")}
            />

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-5">
              <RestaurantFormItem
                item={tableSizes}
                name="Table sizes"
                checkState={[]}
              />
              <RestaurantFormItem
                item={smokingTables}
                name="Tables for smoking"
                checkState={0}
              />
            </div>

            <RestaurantFormEditor
              info="Timeslot Information"
              handleClick={() => setFormView("timeslotInfo")}
            />

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2 mb-5">
              <RestaurantFormItem
                item={timeslots}
                name="Timeslots"
                checkState={initialTimeSlots}
              />
            </div>

            <button
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition mt-6 ml-auto block"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}

        {formView === "basicInfo" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Restaurant Name"
              className="w-full border p-2 mb-4 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
              onClick={() => setFormView("overall")}
            >
              Save
            </button>

            <button
              className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-md shadow-sm transition"
              onClick={() => setFormView("overall")}
            >
              Return
            </button>
          </>
        )}

        {formView === "tableInfo" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Table Sizes</h2>

            <div className="mb-6">
              <button
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300 ease-in-out"
                onClick={() => {
                  setTableSizes((prev) => [...prev, { size: 2, count: 1 }]);
                }}
              >
                Add Table Size
              </button>
            </div>

            {tableSizes.map((table, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-3 bg-gray-50 p-3 rounded"
              >
                <label className="block text-sm font-medium">Size</label>
                <select
                  className="border p-2 rounded"
                  value={table.size}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    const duplicate = tableSizes.some(
                      (t, i) => i !== index && t.size === newSize
                    );
                    if (!duplicate) {
                      const updated = [...tableSizes];
                      updated[index].size = parseInt(e.target.value);
                      setTableSizes(updated);
                    } else {
                      alert(`Table size ${newSize} is already in use.`);
                    }
                  }}
                >
                  {[...Array(8)].map((_, i) => {
                    const value = i + 1;
                    const isUsed = tableSizes.some(
                      (t, i) => t.size === value && i !== index
                    );
                    return (
                      <option key={value} value={value} disabled={isUsed}>
                        {value}
                      </option>
                    );
                  })}
                </select>

                <label className="block text-sm font-medium">Count</label>
                <input
                  type="number"
                  min="1"
                  className="border p-2 rounded w-20"
                  value={table.count}
                  onChange={(e) => {
                    const updated = [...tableSizes];
                    updated[index].count = parseInt(e.target.value);
                    setTableSizes(updated);
                  }}
                />

                <button
                  onClick={() => {
                    setTableSizes((prev) =>
                      prev.filter((_, idx) => idx !== index)
                    );
                  }}
                  className="ml-auto text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md px-4 py-2 text-sm transition duration-300 ease-in-out"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-6">
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
                onClick={() => setFormView("overall")}
              >
                Save
              </button>
              <button
                className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-md shadow-sm transition"
                onClick={() => setFormView("overall")}
              >
                Return
              </button>
            </div>

            {/* Table count and smoking table input */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Summary</h3>
              <div className="flex items-center gap-4 mb-3">
                <label className="block text-sm font-medium">
                  Total Number of Tables
                </label>
                <input
                  type="number"
                  value={numTables}
                  readOnly
                  className="border p-2 rounded w-20"
                />
              </div>

              <div className="flex items-center gap-4 mb-3">
                <label className="block text-sm font-medium">
                  Smoking Tables
                </label>
                <input
                  type="number"
                  min="0"
                  max={tableSizes.reduce(
                    (total, table) => total + table.count,
                    0
                  )}
                  className="border p-2 rounded w-20"
                  value={smokingTables}
                  onChange={(e) =>
                    setSmokingTables(
                      Math.min(
                        e.target.value,
                        tableSizes.reduce(
                          (total, table) => total + table.count,
                          0
                        )
                      )
                    )
                  }
                />
              </div>
            </div>
          </>
        )}

        {formView === "timeslotInfo" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Timeslot Information</h2>

            <div className="mt-6 border-t pt-4 pb-6">
              <h3 className="text-md font-semibold mb-2">Add Timeslot</h3>

              <div className="flex items-center gap-4 mb-4">
                <select
                  className="border p-2 rounded"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {Object.keys(timeslots).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <select
                  className="border p-2 rounded"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                >
                  {Array.from({ length: 19 }, (_, i) => {
                    const hour = (i + 8) % 24;
                    const padded = hour.toString().padStart(2, "0");
                    return (
                      <option key={padded} value={padded}>
                        {padded}
                      </option>
                    );
                  })}
                </select>

                <select
                  className="border p-2 rounded"
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                >
                  {["00", "15", "30", "45"].map((min) => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (!selectedHour || !selectedMinute || !selectedDay)
                      return;

                    const time = `${selectedHour}:${selectedMinute}`;
                    // Cannot add same timeslot twice in a single day
                    if (
                      timeslots[selectedDay]?.some((slot) => slot.time === time)
                    ) {
                      return;
                    }

                    setTimeslots((prev) => ({
                      ...prev,
                      [selectedDay]: [
                        ...prev[selectedDay],
                        { time, status: "available" },
                      ],
                    }));
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                >
                  Add
                </button>
              </div>

              <button
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
                onClick={() => setFormView("overall")}
              >
                Save
              </button>
              <button
                className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-md shadow-sm transition"
                onClick={() => setFormView("overall")}
              >
                Return
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {Object.entries(timeslots).map(([day, slots]) => (
                <div key={day} className="bg-gray-50 p-4 rounded shadow-sm">
                  <h3 className="text-md font-semibold mb-2">{day}</h3>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-2"
                      >
                        <span>{slot.time}</span>
                        <button
                          className="text-red-500 text-sm"
                          onClick={() =>
                            setTimeslots((prev) => ({
                              ...prev,
                              [day]: prev[day].filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AddRestaurant;
