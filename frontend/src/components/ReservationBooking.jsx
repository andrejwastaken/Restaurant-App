import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantReservationData } from "../contexts/RestaurantReservationDataContext";

import ReservationBookingCalendar from "./ReservationBookingCalendar";
import ReservationBookingDetails from "./ReservationBookingDetails";
import Loading from "./Loading";
import ReservationBookingTablesView from "./ReservationBookingTablesView";

function ReservationBooking() {
  const { restaurantData } = useRestaurantReservationData();

  if (!restaurantData) {
    return <Loading>Loading restaurant data...</Loading>;
  }

  return <ReservationBookingContent restaurantData={restaurantData} />;
}

function ReservationBookingContent({ restaurantData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [viewForm, setViewForm] = useState("calendar");
  const [reservationCalendarData, setReservationCalendarData] = useState({
    selectedDate: null,
    selectedTimeSlot: null,
    restaurantOperatingHours: restaurantData.operating_hours,
    restaurantTimeSlot: restaurantData.default_slot_duration,
    restaurantSpecialDays: restaurantData.special_days,
  });
  const [reservationDetailsInitialData, setReservationDetailsInitialData] =
    useState({});

  const [reservationTablesData, setReservationTablesData] = useState({});

  const handleViewForm = (state) => {
    setViewForm(state);
  };

  const handleIsLoading = (state) => {
    setIsLoading(state);
  };

  const handleChangeReservationCalendarData = (newData) => {
    setReservationCalendarData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleChangeReservationDetailsInitialData = (newData) => {
    setReservationDetailsInitialData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleChangeReservationTablesData = (newData) => {
    setReservationTablesData(newData);
  };

  const renderView = () => {
    switch (viewForm) {
      case "calendar":
        return (
          <ReservationBookingCalendar
            reservationCalendarData={reservationCalendarData}
            onChangeReservationCalendarData={
              handleChangeReservationCalendarData
            }
            onChangeViewForm={handleViewForm}
            onSetInitialDetailsData={handleChangeReservationDetailsInitialData}
          />
        );
      case "details":
        return (
          <ReservationBookingDetails
            reservationDetailsInitialData={reservationDetailsInitialData}
            onChangeViewForm={handleViewForm}
            onChangeLoading={handleIsLoading}
            onChangeReservationTablesData={handleChangeReservationTablesData}
          />
        );
      case "tables":
        return (
          <ReservationBookingTablesView
            reservationTablesData={reservationTablesData}
            onChangeViewForm={handleViewForm}
          />
        );
      default:
        return (
          <ReservationBookingCalendar
            reservationCalendarData={reservationCalendarData}
            onChangeReservationCalendarData={
              handleChangeReservationCalendarData
            }
            onChangeViewForm={handleViewForm}
            onSetInitialDetailsData={handleChangeReservationDetailsInitialData}
          />
        );
    }
  };

  return isLoading ? (
    <>
      <Loading>Loading...</Loading>
    </>
  ) : (
    renderView()
  );
}

export default ReservationBooking;
