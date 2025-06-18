import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function ProfileOwnedRestaurantNav() {
  const location = useLocation();

  // Navigation items are defined as objects with a name for display
  // and a path for the URL matching.
  const navItems = [
    { name: "Reservations", path: "reservations" },
    { name: "Special Days", path: "special-days" },
    { name: "Edit Restaurant", path: "edit-restaurant" },
  ];

  // Find the index of the currently active tab by checking if the
  // browser's URL includes the path segment of our navigation item.
  // This makes the component aware of the URL on page load/refresh.
  const activeTabIndex = navItems.findIndex((item) =>
    location.pathname.includes(item.path)
  );

  return (
    <div className="relative w-full mt-10 border-b border-gray-200">
      {/* Container for the clickable NavLinks */}
      <div className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path} // Use the relative path for the link
            // The `className` function gets `isActive` from NavLink automatically,
            // which we use to set the text color.
            className={({ isActive }) =>
              `flex-1 py-4 px-1 text-center font-medium text-sm transition-colors duration-300 focus:outline-none
              ${
                isActive
                  ? "text-amber-600" // Active text color
                  : "text-gray-500 hover:text-gray-700" // Inactive text color
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      {/* The sliding underline element */}
      <div
        className="absolute bottom-0 h-0.5 bg-amber-500 transition-transform duration-300 ease-in-out"
        style={{
          // The width is calculated based on the number of items
          width: `${100 / navItems.length}%`,
          // The transform moves the underline based on the activeTabIndex derived from the URL.
          // If no tab is active (index -1), we default to the first tab's position.
          transform: `translateX(${
            (activeTabIndex === -1 ? 0 : activeTabIndex) * 100
          }%)`,
        }}
      />
    </div>
  );
}

export default ProfileOwnedRestaurantNav;
