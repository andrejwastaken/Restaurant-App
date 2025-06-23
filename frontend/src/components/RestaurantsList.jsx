import { useRestaurantsData } from "../contexts/RestaurantsDataContext";

import Loading from "./Loading";
import RestaurantCard from "./RestaurantCard";

const INITIAL_VISIBLE_COUNT = 10;

function RestaurantsList() {
  const {
    isLoading,
    error,
    filteredRestaurants,
    visibleCount,
    handleLoadLess,
    handleLoadMore,
  } = useRestaurantsData();

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

  return (
    <main className="flex-grow flex flex-col p-4 sm:p-6 md:p-8">
      {isLoading ? (
        <Loading>Drink water!</Loading>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center font-bold text-lg text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {visibleRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <p className="text-center text-amber-600 text-lg font-semibold">
                No restaurants found matching your search.
              </p>
            )}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            {visibleCount > INITIAL_VISIBLE_COUNT && (
              <button
                onClick={handleLoadLess}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Show Less
              </button>
            )}
            {visibleCount < filteredRestaurants.length && (
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
              >
                Load More
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default RestaurantsList;
