import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useParams, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

import RestaurantReservationDataContext from "../../contexts/RestaurantReservationDataContext";
import Loading from "../../components/Loading";

const InfoIcon = ({ children }) => (
  <svg
    className="w-6 h-6 mr-3 text-amber-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

function RestaurantDetailPage() {
  const { restaurantId } = useParams();
  const { isAuthorized, user } = useAuth();

  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/restaurants/${restaurantId}/`
        );
        if (!response.ok) {
          throw new Error("Restaurant not found. It might have been removed.");
        }

        const data = await response.json();

        setRestaurant(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const location = useLocation();
  const isBooking = location.pathname.includes("book");

  const renderView = () => {
    return (
      <main className="flex-grow flex items-center justify-center p-4">
        {isLoading ? (
          <Loading>Fetching tasty details...</Loading>
        ) : error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              An Error Occurred
            </h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-[1.01]">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
              {restaurant.name}
            </h1>

            {/* Restaurant Description */}
            <p className="text-lg text-gray-600 text-center mb-8">
              {restaurant.description}
            </p>

            {/* Details Section */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center">
                {/* Using the InfoIcon component for the phone */}
                <InfoIcon>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </InfoIcon>
                <span className="text-gray-700">{restaurant.phone_number}</span>
              </div>
              <div className="flex items-center">
                {/* Using the InfoIcon component for the address */}
                <InfoIcon>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </InfoIcon>
                <span className="text-gray-700">{restaurant.address}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-10 text-center">
              {isAuthorized ? (
                <NavLink
                  to="book"
                  className="w-full max-w-xs px-8 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                >
                  Check Available Spots
                </NavLink>
              ) : (
                <Link
                  to="/login"
                  className="inline-block w-full max-w-xs px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Log in to see availability.
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    );
  };

  const reservationContextValue = {
    restaurantData: restaurant,
  };

  return isBooking ? (
    <RestaurantReservationDataContext.Provider value={reservationContextValue}>
      <Outlet />
    </RestaurantReservationDataContext.Provider>
  ) : (
    renderView()
  );
}

export default RestaurantDetailPage;
