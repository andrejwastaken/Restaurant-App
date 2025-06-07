import { useState, useEffect } from "react";

import api from "../api/api";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";

function ProfileOwnedRestaurants() {
  const [restaurants, setRestaurants] = useState({});

  useEffect(function () {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/api/owned-restaurants/");
        if (response.status === 200) {
          setRestaurants(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user restaurants: ", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <ProfileMenuContentTitle label="Owned Restaurants" />
    </div>
  );
}

export default ProfileOwnedRestaurants;
