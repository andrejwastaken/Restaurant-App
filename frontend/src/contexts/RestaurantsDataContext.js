import { createContext, useContext } from "react";

const RestaurantsDataContext = createContext(null);

export const useRestaurantsData = () => {
  const context = useContext(RestaurantsDataContext);

  if (context === undefined) {
    throw new Error("Context fail");
  }
  return context;
};

export default RestaurantsDataContext;
