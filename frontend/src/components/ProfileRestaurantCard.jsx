import { NavLink } from "react-router-dom";

function ProfileRestaurantCard({ restaurant }) {
  return (
    <NavLink
      to={`${restaurant.id}`}
      className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-500 transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-between group"
    >
      {/* Left side: Icon and Name */}
      <div className="flex items-center space-x-5">
        <div className="bg-amber-100 p-3 rounded-full border-2 border-amber-200 group-hover:bg-amber-500 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-amber-600 group-hover:text-white transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
          <p className="text-sm text-gray-500">Click to edit or view details</p>
        </div>
      </div>

      {/* Right side: Status and Arrow */}
      <div className="flex items-center space-x-6">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            restaurant.is_validated
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {restaurant.is_validated ? "Validated" : "Pending"}
        </span>
        <div className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </NavLink>
  );
}

export default ProfileRestaurantCard;
