import { useState, useEffect } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";

import api from "../api/api";
import ProfileOwnedRestaurantEditViewFormOverallView from "./ProfileOwnedRestaurantEditViewFormOverallView";
import ProfileOwnedRestaurantEditViewFormOperatingHoursView from "./ProfileOwnedRestaurantEditViewFormOperatingHoursView";
import ProfileOwnedRestaurantEditViewFormBasicView from "./ProfileOwnedRestaurantEditViewFormBasicView";
import toast from "react-hot-toast";

const isDeepEqual = (objA, objB) => {
  if (objA === objB) return true;
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }
  return JSON.stringify(objA) === JSON.stringify(objB);
};

const hasValidationErrors = (restaurant) => {
  if (!restaurant) return true; // Fails if the object itself is null/undefined

  // Check top-level required fields for empty strings
  const requiredTopLevel = ["name", "address", "phone_number"];
  for (const key of requiredTopLevel) {
    // Fails if the key is missing, null, or an empty trimmed string
    if (!restaurant[key] || String(restaurant[key]).trim() === "") return true;
  }

  // Check for setup object and its contents
  const { setup } = restaurant;
  if (!setup) return true;
  // Fails if default_slot_duration is null or undefined
  if (setup.default_slot_duration == null) return true;

  // Check that required lists exist and are not empty arrays
  const requiredLists = ["operating_hours", "table_types", "tables"];
  for (const key of requiredLists) {
    // Fails if the array is missing or has a length of 0
    if (!setup[key] || setup[key].length === 0) return true;
  }

  // Optional deeper validation inside arrays
  if (setup.table_types.some((type) => !type.name || !type.capacity))
    return true;
  if (setup.tables.some((table) => !table.name || !table.table_type))
    return true;

  // If all checks pass, there are no validation errors
  return false;
};

function ProfileOwnedRestaurantViewEditRestaurant() {
  const {
    currentOwnedRestaurant,
    handleCurrentOwnedRestaurant,
    currentOwnedRestaurantSubmitCheck,
    openModal,
    handleLoadingDuringSaveEdit,
  } = useProfileData();

  const [formView, setFormView] = useState("overall");
  const [isLoading, setIsLoading] = useState(false);

  // Bidejki currentOwnedRestaurant e context state ne e promenet pred ovod call sto si ostanuva ist
  // Zatoa mora so newData sto e passed od children
  const handleSave = async (newData) => {
    handleLoadingDuringSaveEdit(true);

    if (
      isDeepEqual(currentOwnedRestaurantSubmitCheck, newData) ||
      hasValidationErrors(newData)
    ) {
      toast.error("Data must be changed and not empty before save.");
      handleLoadingDuringSaveEdit(false);
      return;
    }

    try {
      // --- Step 1: Prepare and send the Profile update ---
      const formattedOperatingHours = newData.setup.operating_hours.map(
        (hour) => ({
          day_of_week: hour.day_of_week,
          open_time: hour.open_time.slice(0, 5),
          close_time: hour.close_time.slice(0, 5),
        })
      );

      const profilePayload = {
        name: newData.name,
        description: newData.description,
        address: newData.address,
        phone_number: newData.phone_number,
        latitude: newData.latitude ? newData.latitude : 0,
        longitude: newData.longitude ? newData.longitude : 0,
        default_slot_duration: newData.setup.default_slot_duration,
        operating_hours: formattedOperatingHours,
        table_types: newData.setup.table_types,
      };

      await api.put(
        `/api/owned-restaurants/${newData.id}/update-profile/`,
        profilePayload
      );

      toast.success("Profile updated successfully!");

      // --- Step 2: Prepare and send the Tables (Floor Plan) update ---
      // The tables from the context are already in the correct backend format.
      const tablesPayload = newData.setup.tables.map((table) => ({
        name: table.name,
        table_type_name: table.table_type,
        is_smoking: table.isSmoking,
        x_position: table.x_position,
        y_position: table.y_position,
        width: table.width,
        height: table.height,
        radius: table.radius,
        shape: table.shape.toUpperCase(),
      }));

      await api.post(
        `api/restaurants/${newData.id}/setup-tables/`,
        tablesPayload
      );

      toast.success("Restaurant and floor plan added successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "An error occurred during the update.";
      toast.error(errorMessage);
    } finally {
      handleLoadingDuringSaveEdit(false);
    }
  };

  useEffect(
    function () {
      if (formView === "tableInfo") {
        setFormView("overall");
        openModal("EDIT_OWNED_TABLE_DATA", null);
      }
    },
    [formView, openModal]
  );

  function handleFormChange(newView) {
    setFormView(newView);
  }

  const basicInformation = {
    name: currentOwnedRestaurant.name,
    address: currentOwnedRestaurant.address,
    phone_number: currentOwnedRestaurant.phone_number,
    description: currentOwnedRestaurant.description,
    default_reservation_slot_duration:
      currentOwnedRestaurant?.setup?.default_slot_duration ?? "",
  };

  const renderCurrentView = () => {
    switch (formView) {
      case "basicInfo":
        return (
          <ProfileOwnedRestaurantEditViewFormBasicView
            onSave={handleSave}
            onReturn={() => setFormView("overall")}
          />
        );

      case "operatingHours":
        return (
          <ProfileOwnedRestaurantEditViewFormOperatingHoursView
            operatingHoursInformation={
              currentOwnedRestaurant?.setup?.operating_hours
            }
            onSave={handleSave}
            onReturn={() => setFormView("overall")}
          />
        );

      case "overall":
      default:
        return (
          <ProfileOwnedRestaurantEditViewFormOverallView
            basicInformation={basicInformation}
            tablesInformation={currentOwnedRestaurant?.setup?.tables}
            operatingHours={currentOwnedRestaurant?.setup?.operating_hours}
            onClick={handleFormChange}
            onSave={handleSave}
          />
        );
    }
  };

  return renderCurrentView();
}

export default ProfileOwnedRestaurantViewEditRestaurant;
