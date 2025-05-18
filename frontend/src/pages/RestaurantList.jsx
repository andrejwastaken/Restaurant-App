import { useEffect, useState } from "react";
import "../index.css";
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

function RestaurantList() {
  const [query, setQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/restaurants/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFilteredRestaurants(data);
        setRestaurants(data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredList = restaurants.filter((r) =>
      r.name.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredRestaurants(filteredList);
  }, [query, restaurants]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleLoadLess = () => {
    setVisibleCount((prev) => prev - 10);
    // Scroll to the top of the page for now :)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  };

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);

  return (
    <div>
      <Navbar />
      <SearchBar query={query} setQuery={setQuery}/>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Restaurants:</h1>

        {loading ? (
          <p className="text-center font-bold">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {visibleCount < restaurants.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                >
                  Load More
                </button>
              </div>
            )}

            {visibleCount > restaurants.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadLess}
                  className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                >
                  Load Less
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default RestaurantList;
