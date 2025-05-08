import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/restaurants",
    element: <RestaurantList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
