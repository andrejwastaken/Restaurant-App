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
    loadingDuringSaveEdit,
    handleLoadingDuringSaveEdit,
  } = useProfileData();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [restaurantId]
  );

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
