import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useRestaurantsData } from "../contexts/RestaurantsDataContext";

import amberIcon from "../assets/amberIcon";
import Loading from "./Loading";

// A helper component to move the map when a search result is found
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        // Zoom level 15
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);
  return null;
}

function RestaurantsMap() {
  const navigate = useNavigate();

  const { isLoading, error, filteredRestaurants } = useRestaurantsData();

  const singleResultPosition =
    filteredRestaurants.length === 1
      ? [filteredRestaurants[0].latitude, filteredRestaurants[0].longitude]
      : null;

  const skopjeCenter = [41.9981, 21.4254];

  return (
    <main className="flex-grow relative">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loading>Mapping out Skopje's finest...</Loading>
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center font-bold text-lg text-red-600">{error}</p>
        </div>
      ) : (
        <MapContainer
          center={skopjeCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", position: "absolute" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredRestaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={[restaurant.latitude, restaurant.longitude]}
              icon={amberIcon}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-2">{restaurant.address}</p>
                  <button
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="px-4 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          <FlyToMarker position={singleResultPosition} />
        </MapContainer>
      )}
      {!isLoading && !error && filteredRestaurants.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-[1000]">
          <p className="text-center text-amber-600 text-lg font-semibold">
            No restaurants found matching your search.
          </p>
        </div>
      )}
    </main>
  );
}

export default RestaurantsMap;
