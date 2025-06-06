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
import AddRestaurant from "./pages/UserManagementPages/AddRestaurant";
import PersonalInfo from "./components/PersonalInfo";

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
        element: <PersonalInfo />,
      },
    ],
  },
  {
    path: "/manage-restaurants",
    element: (
      <ProtectedRoute>
        <AddRestaurant />
      </ProtectedRoute>
    ),
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
