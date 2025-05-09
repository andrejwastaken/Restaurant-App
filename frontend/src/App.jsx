import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RestaurantList from "./components/RestaurantList";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
