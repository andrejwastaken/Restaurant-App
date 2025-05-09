import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RestaurantList from "./components/RestaurantList";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// sredi protected routes koi da se
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    // element: (
    //   <ProtectedRoute>
    //    < />
    //   </ProtectedRoute>
    // ),
  },
  {
    path: "/restaurants",
    element: <RestaurantList />,
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
