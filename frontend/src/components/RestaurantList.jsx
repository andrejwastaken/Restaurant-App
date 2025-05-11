import { useEffect, useState } from "react";
import "../index.css";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import Footer from "./Footer";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
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
        setRestaurants(data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  return (
    <div>
      <Navbar/>
      <SearchBar />
      <h1 className="text-3xl font-bold mb-4 group-hover:">Restaurants: </h1>
      <div className="flex gap-4 h-full justify-center items-center">
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
export default RestaurantList;
