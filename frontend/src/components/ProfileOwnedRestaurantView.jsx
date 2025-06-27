import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useProfileData } from "../contexts/ProfileDataContext";
import { toast } from "react-hot-toast";

import api from "../api/api";
import Loading from "./Loading";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import ProfileOwnedRestaurantNav from "./ProfileOwnedRestaurantNav";

function ProfileOwnedRestaurantView() {
  const { restaurantId } = useParams();
  const {
    currentOwnedRestaurant,
    handleCurrentOwnedRestaurant,
    handleCurrentOwnedRestaurantSubmitCheck,
  } = useProfileData();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(
          `/api/owned-restaurants/${restaurantId}/`
        );
        handleCurrentOwnedRestaurant(response.data);
        handleCurrentOwnedRestaurantSubmitCheck(response.data);
      } catch (err) {
        toast.error("Sorry, there seems to be a problem");
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchRestaurant();

    // Listen for navigation to the same route (remount)
    // This will force a reload if the component is remounted with the same restaurantId
    // or if the user navigates to the same page again
  }, [restaurantId, window.location.key]);

  return (
    <div className="w-full h-full flex flex-col">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading>Loading...</Loading>
        </div>
      ) : (
        <>
          <ProfileMenuContentTitle label={currentOwnedRestaurant?.name || ""} />
          <ProfileOwnedRestaurantNav />
          <div className="flex-grow min-h-0">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileOwnedRestaurantView;
