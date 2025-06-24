import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Register from "./pages/LoginRegisterPages/Register";
import Login from "./pages/LoginRegisterPages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/UserManagementPages/ProfilePage";
import ProfilePersonalInfo from "./components/ProfilePersonalInfo";
import ProfileYourReservations from "./components/ProfileYourReservations.jsx";
import ProfileFavouriteRestaurants from "./components/ProfileFavouriteRestaurants";
import ProfileOwnedRestaurants from "./components/ProfileOwnedRestaurants";
import ProfileOwnedRestaurantView from "./components/ProfileOwnedRestaurantView";
import ProfileOwnedRestaurantViewReservations from "./components/ProfileOwnedRestaurantViewReservations";
import ProfileOwnedRestaurantViewSpecialDays from "./components/ProfileOwnedRestaurantViewSpecialDays";
import ProfileOwnedRestaurantViewEditRestaurant from "./components/ProfileOwnedRestaurantViewEditRestaurant";
import ProfileAddRestaurant from "./components/ProfileAddRestaurant";
import RestaurantDetailPage from "./pages/ReservationPages/RestaurantDetailPage";
import Finalizer from "./pages/ReservationPages/ReservationFinalizer";
import ReservationInformation from "./components/ReservationInformation.jsx";
import ProfileOwnedRestaurantViewReservationDetailView from "./components/ProfileOwnedRestaurantViewReservationDetailView";
import Restaurants from "./pages/Restaurants.jsx";
import RestaurantsMap from "./components/RestaurantsMap.jsx";
import RestaurantsList from "./components/RestaurantsList.jsx";
import ReservationBooking from "./components/ReservationBooking.jsx";
import ReservationQrPage from "./components/ReservationQRPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/restaurants",
    element: <Restaurants />,
    children: [
      {
        index: true,
        element: <Navigate to="map-view" replace />,
      },
      {
        path: "list-view",
        element: <RestaurantsList />,
      },
      {
        path: "map-view",
        element: <RestaurantsMap />,
      },
      {
        path: ":restaurantId",
        element: <RestaurantDetailPage />,
        children: [
          {
            path: "book",
            element: (
              <ProtectedRoute>
                <ReservationBooking />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/confirm-booking",
    element: (
      <ProtectedRoute>
        <Finalizer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="personal-info" replace />,
      },
      {
        path: "personal-info",
        element: <ProfilePersonalInfo />,
      },
      {
        path: "reservations",
        element: <ReservationInformation />,
      },
      {
        path: "your-reservations",
        element: <ProfileYourReservations />,
      },
      {
        path: "your-reservations/:reservationId",
        element: <ReservationQrPage />,
      },
      {
        path: "favourite-restaurants",
        element: <ProfileFavouriteRestaurants />,
      },
      {
        path: "owned-restaurants",
        element: <ProfileOwnedRestaurants />,
        children: [
          {
            path: ":restaurantId",
            element: <ProfileOwnedRestaurantView />,
            children: [
              {
                index: true,
                element: <Navigate to="reservations" replace />,
              },
              {
                path: "reservations",
                element: <ProfileOwnedRestaurantViewReservations />,
              },
              {
                path: "reservations/:reservationId",
                element: <ProfileOwnedRestaurantViewReservationDetailView />,
              },
              {
                path: "special-days",
                element: <ProfileOwnedRestaurantViewSpecialDays />,
              },
              {
                path: "edit-restaurant",
                element: <ProfileOwnedRestaurantViewEditRestaurant />,
              },
            ],
          },
        ],
      },
      {
        path: "add-restaurant",
        element: <ProfileAddRestaurant />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
