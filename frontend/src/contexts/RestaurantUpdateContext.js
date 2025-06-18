import { createContext, useContext } from "react";

const RestaurantUpdateContext = createContext(null);

export const useRestaurantUpdate = () => {
  const context = useContext(RestaurantUpdateContext);

  if (context === undefined) {
    throw new Error("Context fail");
  }
  return context;
};

export default RestaurantUpdateContext;
