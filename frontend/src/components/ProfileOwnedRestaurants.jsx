import { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";

import api from "../api/api";
// import RestaurantUpdateContext from "../contexts/RestaurantUpdateContext";
import Loading from "./Loading";
import ProfileOwnedRestaurantsList from "./ProfileOwnedRestaurantsList";
import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurants() {
  const [restaurants, setRestaurants] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { loadingDuringSaveEdit } = useProfileData();
  const { restaurantId } = useParams();

  useEffect(function () {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/api/owned-restaurants/");
        if (response.status === 200) {
          setRestaurants(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user restaurants: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchRestaurants();
  }, []);

  return (
    <div className="w-full h-full p-6 flex flex-col">
      {isLoading ? (
        <Loading>Loading your restaurants...</Loading>
      ) : loadingDuringSaveEdit ? (
        <Loading>Saving your data...</Loading>
      ) : restaurantId ? (
        <Outlet />
      ) : (
        <ProfileOwnedRestaurantsList restaurants={restaurants} />
      )}
    </div>
  );
}

export default ProfileOwnedRestaurants;
