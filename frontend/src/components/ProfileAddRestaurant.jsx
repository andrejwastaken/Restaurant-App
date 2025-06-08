import { useState, useEffect } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";
import { toast } from "react-hot-toast";

import api from "../api/api";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormOverallView from "./RestaurantFormOverallView";
import RestaurantFormBasicView from "./RestaurantFormBasicView";
import RestaurantFormTableView from "./RestaurantFormTableView";
import RestaurantFormTimeslotView from "./RestaurantFormTimeslotView";
import Loading from "./Loading";

// check state for Empty write
const initialTimeSlots = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

function ProfileAddRestaurant() {
  const { addRestaurantData, handleSaveAddRestaurantItem } = useProfileData();
  const { basicInformation, tableInformation, timeslotInformation } =
    addRestaurantData;

  const [formView, setFormView] = useState("overall");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    const timeSlotIsEmpty = Object.values(
      addRestaurantData.timeslotInformation
    ).every((day) => day.length === 0);
    if (
      !basicInformation.name ||
      !basicInformation.description ||
      !basicInformation.address ||
      !basicInformation.phone_number ||
      tableInformation.length === 0 ||
      timeSlotIsEmpty
    ) {
      toast.error("All fields must be filled in order to add a restaurant.");
      return;
    }

    const numTables = tableInformation.reduce(
      (total, table) => total + table.count,
      0
    );

    setIsLoading(true);

    try {
      const payload = {
        name: basicInformation.name,
        description: basicInformation.description,
        address: basicInformation.address,
        phone_number: basicInformation.phone_number,
        restaurant_setup: {
          num_tables: numTables,
          timeslots_by_day: timeslotInformation,
          tables_by_size: tableInformation,
        },
      };

      await api.post("api/add-restaurant/", payload);
      toast.success("Restaurant added successfully!");
    } catch (error) {
      const status = error.response.data?.name + "!" || "Unexpected error!";
      toast.error(status);
    } finally {
      setIsLoading(false);
    }
  }

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

      case "tableInfo":
        return (
          <RestaurantFormTableView
            tableInformation={addRestaurantData.tableInformation}
            onSave={handleSaveAddRestaurantItem}
            onReturn={() => setFormView("overall")}
          />
        );

      case "timeslotInfo":
        return (
          <RestaurantFormTimeslotView
            timeslotInformation={addRestaurantData.timeslotInformation}
            onSave={handleSaveAddRestaurantItem}
            onReturn={() => setFormView("overall")}
          />
        );

      case "overall":
      default:
        return (
          <RestaurantFormOverallView
            basicInformation={addRestaurantData.basicInformation}
            tableSizes={addRestaurantData.tableInformation}
            timeslots={addRestaurantData.timeslotInformation}
            initialTimeSlots={initialTimeSlots}
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
    renderCurrentView()
  );
}

export default ProfileAddRestaurant;
