import { useState } from "react";
import { toast } from "react-hot-toast";

import api from "../api/api";
import RestaurantFormAddressMap from "./RestaurantFormAddressMap";
import RestaurantFormAddressSidebar from "./RestaurantFormAddressSidebar";
import { useProfileData } from "../contexts/ProfileDataContext";

function ProfileOwnedRestaurantEditAddressConfiguration() {
  const { currentOwnedRestaurant, handleCurrentOwnedRestaurant } =
    useProfileData();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    address: currentOwnedRestaurant.address,
    longitude: currentOwnedRestaurant.longitude
      ? currentOwnedRestaurant.longitude
      : 0,
    latitude: currentOwnedRestaurant.latitude
      ? currentOwnedRestaurant.latitude
      : 0,
  });

  const handleSave = () => {
    if (
      currentOwnedRestaurant.address.trim() === currentAddress.address.trim() ||
      currentAddress.address.trim().length === 0
    ) {
      toast.error("Data must be changed or filled");
      return;
    }

    if (
      currentAddress.longitude === currentOwnedRestaurant.longitude ||
      currentAddress.latitude === currentOwnedRestaurant.latitude
    ) {
      toast.error("You need to find your restaurant on the map");
      return;
    }
    const newAddressData = {
      ...currentOwnedRestaurant,
      address: currentAddress.address,
      longitude: currentAddress.longitude,
      latitude: currentAddress.latitude,
    };
    toast.success("Address updated successfully!");
    handleCurrentOwnedRestaurant(newAddressData);
  };

  const handleGeocode = async () => {
    if (!currentAddress) {
      toast.error("Please enter an address first.");
      return;
    }
    setIsGeocoding(true);
    try {
      const response = await api.post("api/geocode/", {
        address: currentAddress.address,
      });
      const { latitude, longitude } = response.data;
      setCurrentAddress((prev) => ({ ...prev, latitude, longitude }));
    } catch (error) {
      console.error("Geocoding failed", error);
      toast.error(
        "Failed to geocode address. Please check the address and try again."
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  const handlePositionChange = async (lat, lng) => {
    // Optimistically update coordinates in state
    setCurrentAddress((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    setIsReverseGeocoding(true);
    try {
      const response = await api.post("api/reverse-geocode/", {
        latitude: lat,
        longitude: lng,
      });
      let { address } = response.data;
      const formatted_address = address.split(",").slice(0, 2);
      address = formatted_address[1].trim() + " " + formatted_address[0].trim();
      address = address.trim();
      if (address) {
        setCurrentAddress((prev) => ({ ...prev, address: address }));
      } else {
        toast.error("No address found for this location.");
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      toast.error(
        "Failed to retrieve address. Please try a different location."
      );
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setCurrentAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full h-full flex justify-between space-x-4">
      <div className="w-3/4">
        <RestaurantFormAddressMap
          currentAddress={currentAddress}
          onPositionChange={handlePositionChange}
        />
      </div>

      <div className="w-1/4 h-full min-h-0 flex flex-col">
        <RestaurantFormAddressSidebar
          currentAddress={currentAddress}
          onChangeAddress={handleAddressChange}
          isGeocoding={isGeocoding || isReverseGeocoding}
          onGeocode={handleGeocode}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default ProfileOwnedRestaurantEditAddressConfiguration;
