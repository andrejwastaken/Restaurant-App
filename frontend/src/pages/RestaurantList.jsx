import { useEffect, useState } from "react";
import "../index.css"; // Make sure this path is correct
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const INITIAL_VISIBLE_COUNT = 10;

function RestaurantList() {
  const [query, setQuery] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/restaurants/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch restaurants. Please try again later."
          );
        }
        return response.json();
      })
      .then((data) => {
        setAllRestaurants(data);
        setFilteredRestaurants(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredList = allRestaurants.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filteredList);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [query, allRestaurants]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleLoadLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

  return (
    // Applied flex layout for sticky footer
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <SearchBar query={query} setQuery={setQuery} />
      {/* Main content area now grows to push footer down */}
      <main className="flex-grow flex flex-col p-4 sm:p-6 md:p-8">
        {isLoading ? (
          <Loading>Drink water!</Loading>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-center font-bold text-lg text-red-600">
              {error}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8">
              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
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

      <Footer />
    </div>
  );
}

export default RestaurantList;
