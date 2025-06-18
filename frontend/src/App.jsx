import "./index.css";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RestaurantList from "./pages/RestaurantList";
import Home from "./pages/Home";
import Register from "./pages/LoginRegisterPages/Register";
import Login from "./pages/LoginRegisterPages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/UserManagementPages/ProfilePage";
import ProfilePersonalInfo from "./components/ProfilePersonalInfo";
import ProfileReservationHistory from "./components/ProfileReservationHistory";
import ProfileFavouriteRestaurants from "./components/ProfileFavouriteRestaurants";
import ProfileOwnedRestaurants from "./components/ProfileOwnedRestaurants";
import ProfileOwnedRestaurantView from "./components/ProfileOwnedRestaurantView";
import ProfileOwnedRestaurantViewReservations from "./components/ProfileOwnedRestaurantViewReservations";
import ProfileOwnedRestaurantViewSpecialDays from "./components/ProfileOwnedRestaurantViewSpecialDays";
import ProfileOwnedRestaurantViewEditRestaurant from "./components/ProfileOwnedRestaurantViewEditRestaurant";
import ProfileAddRestaurant from "./components/ProfileAddRestaurant";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import RestaurantsCalendar from "./pages/RestaurantsCalendar";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/restaurants",
		element: <RestaurantList />,
	},
	{
		path: "/restaurants/:id",
		element: <RestaurantDetailPage />,
	},
	{
		path: "/restaurants-calendar/:id",
		element: (
			<ProtectedRoute>
				<RestaurantsCalendar />
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
				path: "reservation-history",
				element: <ProfileReservationHistory />,
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
