import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RestaurantList from "./components/RestaurantList";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
<<<<<<< Updated upstream
=======
import ProfilePage from "./pages/ProfilePage";
import AddRestaurant from "./pages/AddRestaurant";
>>>>>>> Stashed changes

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/restaurants",
    element: (
      <ProtectedRoute>
        <RestaurantList />
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
<<<<<<< Updated upstream
=======
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-restaurant",
    element: <AddRestaurant />,
  },
>>>>>>> Stashed changes
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
