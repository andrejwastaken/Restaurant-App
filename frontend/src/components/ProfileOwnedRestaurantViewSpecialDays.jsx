import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useProfileData } from "../contexts/ProfileDataContext";
import { useParams } from "react-router-dom";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import SpecialDayCard from "./SpecialDayCard";
import SpecialDayAddForm from "./SpecialDayAddForm";
import SpecialDayDetailView from "./SpecialDayDetailView";
import SpecialDayList from "./SpecialDayList";

import api from "../api/api";

function ProfileOwnedRestaurantViewSpecialDays() {
  const { currentOwnedRestaurant, handleLoadingDuringSaveEdit } =
    useProfileData();
  const { restaurantId } = useParams();

  // This state would typically live in a parent component
  const [specialDays, setSpecialDays] = useState(
    currentOwnedRestaurant?.setup?.special_days || []
  );

  // State to manage which view is active: 'list', 'adding', or 'viewing'
  const [viewMode, setViewMode] = useState("list");
  const [selectedDayId, setSelectedDayId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Using a fixed number for stable layout

  // --- Derived State for Pagination ---
  const totalPages = Math.ceil(specialDays.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpecialDays = specialDays.slice(startIndex, endIndex);

  const [newSpecialDay, setNewSpecialDay] = useState({
    day: "",
    open_time: "09:00",
    close_time: "17:00",
    description: "",
  });

  const handleChangeNewSpecialDay = (e) => {
    const { name, value } = e.target;

    // Create the potential new state to validate against
    const newState = { ...newSpecialDay, [name]: value };

    setNewSpecialDay(newState);
  };

  const handleViewDay = (dayId) => {
    setSelectedDayId(dayId);
    setViewMode("viewing");
  };

  const handleBackToList = () => {
    setSelectedDayId(null);
    setViewMode("list");
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleViewMode = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [specialDays.length, currentPage, totalPages]);

  const handleSave = async () => {
    handleLoadingDuringSaveEdit(true);

    if (newSpecialDay.day === "" || newSpecialDay.description.trim() === "") {
      toast.error("All information must be filled");
      handleLoadingDuringSaveEdit(false);
      return;
    }

    const payload = {
      day: newSpecialDay.day,
      open_time: newSpecialDay.open_time,
      close_time: newSpecialDay.close_time,
      description: newSpecialDay.description,
    };

    try {
      const response = await api.post(
        `api/owned-restaurant/${restaurantId}/add-special-day/`,
        payload
      );
      if (response.status === 200) {
        toast.success("Successfully added.");
      }
    } catch (error) {
      toast.error("There was a problem.");
    } finally {
      handleLoadingDuringSaveEdit(false);
      handleViewMode("list");
    }
  };

  const handleDelete = async () => {
    handleLoadingDuringSaveEdit(true);

    try {
      const response = await api.delete(
        `api/owned-restaurant/${restaurantId}/special-day/${selectedDayId}/delete/`
      );
      if (response.status === 200) {
        toast.success("Successfully deleted.");
      }
    } catch (error) {
      toast.error("There was a problem.");
    } finally {
      handleLoadingDuringSaveEdit(false);
      handleViewMode("list");
    }
  };

  // --- RENDER LOGIC BASED ON VIEWMODE ---
  let content;

  if (viewMode === "list") {
    content = (
      <SpecialDayList
        specialDays={specialDays}
        currentSpecialDays={currentSpecialDays}
        onViewDay={handleViewDay}
        totalPages={totalPages}
        currentPage={currentPage}
        onCurrentPage={handleCurrentPage}
        onViewMode={handleViewMode}
      />
    );
  } else if (viewMode === "viewing") {
    const selectedDay = specialDays.find((day) => day.id === selectedDayId);
    content = (
      <SpecialDayDetailView
        selectedDay={selectedDay}
        onDelete={handleDelete}
        onReturn={handleBackToList}
      />
    );
  } else if (viewMode === "adding") {
    content = (
      <SpecialDayAddForm
        specialDay={newSpecialDay}
        onChangeNewSpecialDay={handleChangeNewSpecialDay}
        onViewMode={handleViewMode}
        onSave={handleSave}
      />
    );
  }

  return (
    // The main container, taking up the full available width and height.
    <div className="w-full h-full">{content}</div>
  );
}

export default ProfileOwnedRestaurantViewSpecialDays;
