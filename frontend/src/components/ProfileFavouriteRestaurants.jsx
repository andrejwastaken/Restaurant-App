import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../api/api";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import ProfileFavouriteRestaurantsList from "./ProfileFavouriteRestaurantsList";
import Loading from "./Loading";

function ProfileFavouriteRestaurants() {
  const [isLoading, setIsLoading] = useState(false);
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([]);

  useEffect(() => {
    const fetchFavouriteRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("api/favourite-restaurants/list/");
        setFavouriteRestaurants(response.data);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavouriteRestaurants();
  }, []);

  return (
    <div className="w-full h-full p-6 flex flex-col">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading>Loading favourite restaurants...</Loading>
        </div>
      ) : (
        <>
          <ProfileMenuContentTitle label="Favourite Restaurants" />

          <div className="flex-grow mt-10">
            <ProfileFavouriteRestaurantsList
              restaurants={favouriteRestaurants}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileFavouriteRestaurants;
