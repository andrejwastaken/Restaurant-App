import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";

import api from "../api/api";

function ProfileMenuSideBar() {
  const { user } = useProfileData();
  const navigate = useNavigate();

  async function handleLogout() {
    const refresh = localStorage.getItem("refresh");

    try {
      await api.post("/auth/logout/", { refresh });
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/");
    }
  }

  const navLinkBaseClasses =
    "text-center w-full text-left px-4 py-6 rounded-none text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none transition-colors ease-in-out duration-150 border-b-2 border-gray-200";

  return (
    <div className="bg-white flex flex-col shadow-md overflow-y-auto flex-grow">
      <div className="p-6 mt-1">
        <div className="flex flex-col items-center text-center space-y-2.5">
          <h5 className="text-2xl font-semibold text-gray-800">
            {user.username}
          </h5>
          <p className="text-[15px] text-gray-600 font-medium">{user.email}</p>
        </div>
      </div>

      <hr className="w-full border-t-2 border-gray-200 my-1" />

      <div className="px-6 pb-6 pt-2">
        <nav className="flex flex-col">
          <NavLink
            to="personal-info"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? "bg-gray-300 text-gray-900" : "bg-white"
              }`
            }
          >
            Personal Information
          </NavLink>

          <NavLink
            to="your-reservations"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? "bg-gray-300 text-gray-900" : "bg-white"
              }`
            }
          >
            Your reservations
          </NavLink>

          <NavLink
            to="favourite-restaurants"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? "bg-gray-300 text-gray-900" : "bg-white"
              }`
            }
          >
            Favourite Restaurants
          </NavLink>
        </nav>
      </div>

      <hr className="w-full border-t-2 border-gray-200 my-1" />

      <div className="px-6 pb-6 pt-3">
        <nav className="flex flex-col">
          <NavLink
            to="owned-restaurants"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? "bg-gray-300 text-gray-900" : "bg-white"
              }`
            }
          >
            Owned Restaurants
          </NavLink>

          <NavLink
            to="add-restaurant"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? "bg-gray-300 text-gray-900" : "bg-white"
              }`
            }
          >
            Add a Restaurant
          </NavLink>
        </nav>
      </div>

      <hr className="w-full border-t-2 border-gray-200 my-1" />

      <div className="px-6 pb-6 pt-3">
        <nav className="flex flex-col">
          <button
            type="button"
            onClick={handleLogout}
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
