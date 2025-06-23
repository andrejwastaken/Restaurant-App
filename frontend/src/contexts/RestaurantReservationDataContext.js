import { createContext, useContext } from "react";

const RestaurantReservationDataContext = createContext(null);

export const useRestaurantReservationData = () => {
  const context = useContext(RestaurantReservationDataContext);

  if (context === undefined) {
    throw new Error("Context fail");
  }
  return context;
};

export default RestaurantReservationDataContext;
