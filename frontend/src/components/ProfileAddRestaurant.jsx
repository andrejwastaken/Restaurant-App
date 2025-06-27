import { useState, useEffect } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";
import { toast } from "react-hot-toast";

import api from "../api/api";
import RestaurantFormOverallView from "./RestaurantFormOverallView";
import RestaurantFormBasicView from "./RestaurantFormBasicView";
import RestaurantFormOperatingHoursView from "./RestaurantFormOperatingHoursView";
import Loading from "./Loading";

function ProfileAddRestaurant() {
  const { openModal, addRestaurantData, handleSaveAddRestaurantItem } =
    useProfileData();
  const {
    basicInformation,
    tableTypesInformation,
    tablesInformation,
    operatingHoursInformation,
  } = addRestaurantData;

  const [formView, setFormView] = useState("overall");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (
      !basicInformation.name ||
      !basicInformation.description ||
      !basicInformation.address ||
      !basicInformation.phone_number ||
      !basicInformation.default_reservation_slot_duration ||
      tableTypesInformation.length === 0 ||
      tablesInformation.length === 0 ||
      operatingHoursInformation.length === 0
    ) {
      toast.error("All fields must be filled in order to add a restaurant.");
      return;
    }

    setIsLoading(true);

    try {
      const basicConfigPayload = {
        name: basicInformation.name,
        description: basicInformation.description,
        address: basicInformation.address,
        phone_number: basicInformation.phone_number,
        latitude: basicInformation.latitude,
        longitude: basicInformation.longitude,
        setup: {
          default_slot_duration:
            basicInformation.default_reservation_slot_duration,
        },
        table_types: tableTypesInformation,
        operating_hours: operatingHoursInformation,
      };

      const response = await api.post(
        "api/add-restaurant/",
        basicConfigPayload
      );
      const newRestaurantId = response.data.id;

      if (!newRestaurantId) {
        toast.error("Something went wrong.");
        setIsLoading(false);
        return;
      }

      const tablesPayload = tablesInformation.map((table) => ({
        name: table.name,
        table_type_name: table.table_type,
        is_smoking: table.isSmoking,
        x_position: table.x,
        y_position: table.y,
        width: table.width,
        height: table.height,
        radius: table.radius,
        shape: table.shape.toUpperCase(),
      }));

      await api.post(
        `api/restaurants/${newRestaurantId}/setup-tables/`,
        tablesPayload
      );

      toast.success("Restaurant and floor plan added successfully!");
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      const errorData = error.response?.data;

      if (errorData) {
        if (typeof errorData.detail === "string") {
          // Handles simple error strings like {"detail": "Not found."}
          errorMessage = errorData.detail;
        } else if (typeof errorData === "object") {
          // Handles DRF validation errors like {"field_name": ["This field is required."]}
          const firstErrorKey = Object.keys(errorData)[0];
          const firstErrorMessages = errorData[firstErrorKey];
          if (
            Array.isArray(firstErrorMessages) &&
            firstErrorMessages.length > 0
          ) {
            errorMessage = `${firstErrorKey}: ${firstErrorMessages[0]}`;
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(
    function () {
      if (formView === "tableInfo") {
        setFormView("overall");
        openModal("EDIT_TABLE_DATA", null);
      }
    },
    [formView, openModal]
  );

  function handleFormChange(newView) {
    setFormView(newView);
  }

  const renderCurrentView = () => {
    switch (formView) {
      case "basicInfo":
        return (
          <RestaurantFormBasicView
            basicInformation={addRestaurantData.basicInformation}
            onSave={handleSaveAddRestaurantItem}
            onReturn={() => setFormView("overall")}
          />
        );

      case "operatingHours":
        return (
          <RestaurantFormOperatingHoursView
            operatingHoursInformation={operatingHoursInformation}
            onSave={handleSaveAddRestaurantItem}
            onReturn={() => setFormView("overall")}
          />
        );

      case "overall":
      default:
        return (
          <RestaurantFormOverallView
            basicInformation={basicInformation}
            tablesInformation={tablesInformation}
            operatingHours={operatingHoursInformation}
            onClick={handleFormChange}
            onSubmit={handleSubmit}
          />
        );
    }
  };

  return isLoading ? (
    <div className="w-full h-full flex items-center">
      <Loading>Adding a restaurant...</Loading>
    </div>
  ) : (
    <div className="w-full h-full flex flex-col">{renderCurrentView()}</div>
  );
}

export default ProfileAddRestaurant;
