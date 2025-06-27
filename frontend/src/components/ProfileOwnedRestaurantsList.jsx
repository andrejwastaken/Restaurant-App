import { useState, useEffect } from "react";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import ProfileRestaurantCard from "./ProfileRestaurantCard";

function ProfileOwnedRestaurantsList({ restaurants }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth < 820 ? 5 : 4
  );

  const restaurantsArray = Array.isArray(restaurants) ? restaurants : [];

  useEffect(() => {
    const handleResize = () => {
      // Sets 5 items for wider screens, 4 for smaller ones.
      setItemsPerPage(window.innerWidth < 820 ? 5 : 4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentRestaurants = restaurantsArray.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <>
      <ProfileMenuContentTitle label="Owned Restaurants" />
      <div className="w-full h-full mt-6 flex flex-col justify-between">
        {restaurantsArray.length > 0 ? (
          <>
            <div className="flex-grow space-y-4">
              {currentRestaurants.map((restaurant) => (
                <ProfileRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pt-8 mt-auto flex items-center justify-between text-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="font-medium text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full min-h-[400px] flex justify-center items-center text-center">
            <h3 className="text-xl font-semibold text-gray-500">
              Oops, seems like you don't have any restaurants yet.
            </h3>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileOwnedRestaurantsList;
