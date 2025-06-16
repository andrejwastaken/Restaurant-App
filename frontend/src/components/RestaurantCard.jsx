import { useState } from "react";
import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const [showModal, setShowModal] = useState(false);
  const restaurantSetup = restaurant.restaurant_setup;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="border rounded-lg shadow p-4">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <p>{restaurant.description}</p>
        <div className="flex justify-end  mt-2">
          <Link
            to={`/restaurant-details/${restaurant.id}`}
            state={{ restaurant }}
            className="mt-2 bg-amber-500 text-white py-1 px-4 rounded hover:bg-amber-600"
          >
            View details.
          </Link>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mb-4 px-3 py-1 bg-red-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>

            {restaurantSetup ? (
              <div>
                <p>
                  <strong>Total Tables:</strong>{" "}
                  {restaurantSetup.num_tables ?? "N/A"}
                </p>
                <p>
                  <strong>Smoking Tables:</strong>{" "}
                  {restaurantSetup.num_tables_smoking ?? "N/A"}
                </p>

                <p>
                  <strong>Tables by Size:</strong>
                </p>
                <ul className="list-disc ml-5">
                  {restaurantSetup.tables_by_size &&
                  restaurantSetup.tables_by_size.length > 0 ? (
                    restaurantSetup.tables_by_size.map((table, idx) => (
                      <li key={idx}>
                        Seats: <strong>{table.size}</strong> - Count:{" "}
                        <strong>{table.count}</strong>
                      </li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>

                <p>
                  <strong>Time Slots by Day:</strong>
                </p>
                <ul className="list-disc ml-5">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const slots = restaurantSetup.timeslots_by_day?.[day] || [];
                    return (
                      <li key={day}>
                        <strong>{day}:</strong>{" "}
                        {slots.length > 0
                          ? slots.map((slot, i) => (
                              <span key={i}>
                                {slot.time} ({slot.status})
                                {i < slots.length - 1 ? ", " : ""}
                              </span>
                            ))
                          : "No slots"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p>No information available for this restaurant.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
