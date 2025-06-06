import { NavLink } from "react-router-dom";
import { useState } from "react";

function ProfileMenuSideBar() {
  const [activeButton, setActiveButton] = useState("personal-info");

  return (
    <div className="bg-white flex flex-col shadow-md overflow-y-auto flex-grow">
      {/* Name Box */}
      <div className="p-6 mt-1">
        <div className="flex flex-col items-center text-center space-y-2.5">
          <h5 className="text-2xl font-semibold text-gray-800">Marko</h5>
          <p className="text-[15px] text-gray-600 font-medium">
            popovicmarko1343@gmail.com
          </p>
        </div>
      </div>

      <hr className="w-full border-t-2 border-gray-200 my-1" />

      {/*  */}
      {/* Buttons */}
      <div className="px-6 pb-6 pt-2">
        <nav className="flex flex-col">
          <NavLink
            to="personal-info"
            className={`
              text-center w-full text-left px-4 py-6 rounded-none 
              text-sm font-medium 
              text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 
              border-b-2 border-gray-200
              ${
                activeButton === "personal-info"
                  ? "bg-gray-300 text-gray-900"
                  : "bg-white"
              }
            `}
            onClick={() => setActiveButton("personal-info")}
          >
            Personal Information
          </NavLink>

          <NavLink
            to="personal-info"
            className={`
              text-center w-full text-left px-4 py-6 rounded-none 
              text-sm font-medium 
              text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 
              border-b-2 border-gray-200
              ${
                activeButton === "reservation-history"
                  ? "bg-gray-300 text-gray-900"
                  : "bg-white"
              }
            `}
          >
            Reservation History
          </NavLink>

          <NavLink
            to="personal-info"
            className={`
              text-center w-full text-left px-4 py-6 rounded-none 
              text-sm font-medium 
              text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 
              border-b-2 border-gray-200
              ${
                activeButton === "favourite-restaurants"
                  ? "bg-gray-300 text-gray-900"
                  : "bg-white"
              }
            `}
          >
            Favourite Restaurants
          </NavLink>
        </nav>
      </div>

      {/* Line */}
      <hr className="w-full border-t-2 border-gray-200 my-1" />

      <div className="px-6 pb-6 pt-3">
        <nav className="flex flex-col">
          <button
            type="button"
            className="text-center w-full text-left px-4 py-6 rounded-none text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 border-b-2 border-gray-200"
          >
            Owned Restaurants
          </button>

          <button
            type="button"
            className="text-center w-full text-left px-4 py-6 rounded-none text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 border-b-2 border-gray-200"
          >
            Add a Restaurant
          </button>
        </nav>
      </div>

      {/* Line */}
      <hr className="w-full border-t-2 border-gray-200 my-1" />

      <div className="px-6 pb-6 pt-3">
        <nav className="flex flex-col">
          <button
            type="button"
            className="flex justify-center items-center w-full text-left px-4 py-6 rounded-none text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 border-b-2 border-gray-200"
          >
            Logout <span className="ml-2 text-xl"> &rarr;</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default ProfileMenuSideBar;
