import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/restaurants" element={<RestaurantList/>} />
      </Routes>
    </Router>
  );
}

export default App;
