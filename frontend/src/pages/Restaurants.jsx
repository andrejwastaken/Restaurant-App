import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import RestaurantsDataContext from "../contexts/RestaurantsDataContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

const INITIAL_VISIBLE_COUNT = 10;

function Restaurants() {
  const { restaurantId } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");;

  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    fetch("http://localhost:8000/api/restaurants/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant locations.");
        }
        return response.json();
      })
      .then((data) => {
        // Filter out any restaurants that don't have coordinates
        const locatedRestaurants = data.filter(
          (r) => r.latitude && r.longitude
        );
        setAllRestaurants(locatedRestaurants);
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

  const restaurantsContextValue = {
    isLoading: isLoading,
    error: error,
    filteredRestaurants: filteredRestaurants,
    visibleCount: visibleCount,
    handleLoadMore: handleLoadMore,
    handleLoadLess: handleLoadLess,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      {!restaurantId && <SearchBar query={query} setQuery={setQuery} />}

      <RestaurantsDataContext.Provider value={restaurantsContextValue}>
        <Outlet />
      </RestaurantsDataContext.Provider>

      <Footer />
    </div>
  );
}

export default Restaurants;
