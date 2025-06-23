import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  Cigarette,
  Clock,
  Calendar,
  Search,
} from "lucide-react";

import api from "../api/api";

const InfoSection = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

function ReservationBookingDetails({
  reservationDetailsInitialData,
  onChangeViewForm,
  onChangeLoading,
  onChangeReservationTablesData,
}) {
  const {
    selectedInitialDate,
    selectedDay,
    selectedTimeSlot,
    restaurantOperatingHours,
    restaurantSpecialDays,
    restaurantTimeSlot,
  } = reservationDetailsInitialData;

  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId } = useParams();

  const day = parseInt(selectedDay);
  const selectedDateISO = selectedInitialDate;
  const defaultSlotDuration = restaurantTimeSlot;
  const selectedDate = useMemo(
    () => new Date(selectedDateISO),
    [selectedDateISO]
  );

  const [partySize, setPartySize] = useState("");
  const [isSmoker, setIsSmoker] = useState(false);
  const [duration, setDuration] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    if (partySize && duration) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [partySize, duration]);

  const durationOptions = useMemo(() => {
    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !restaurantOperatingHours ||
      !restaurantSpecialDays
    ) {
      return [];
    }
    let closeTimeStr = null;

    const dateString = selectedDate.toISOString().split("T")[0];
    const specialDay = restaurantSpecialDays.find((d) => d.day === dateString);

    if (specialDay) {
      closeTimeStr = specialDay.close_time;
    } else {
      const dayOfWeek = selectedDate.getDay();
      const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday is 0, Sunday is 6

      const operatingHours = restaurantOperatingHours.find(
        (h) => h.day_of_week === mondayBasedDay
      );
      if (operatingHours) {
        closeTimeStr = operatingHours.close_time;
      }
    }

    if (!closeTimeStr) {
      return [];
    }

    const [closeHour, closeMin] = closeTimeStr.split(":").map(Number);
    const [startHour, startMin] = selectedTimeSlot.split(":").map(Number);

    const startTimeInMinutes = startHour * 60 + startMin;
    const closeTimeInMinutes = closeHour * 60 + closeMin;

    const maxDuration = closeTimeInMinutes - startTimeInMinutes;
    const options = [];

    for (
      let d = defaultSlotDuration;
      d <= maxDuration;
      d += defaultSlotDuration
    ) {
      options.push(d);
    }
    return options;
  }, [
    selectedDate,
    selectedTimeSlot,
    restaurantOperatingHours,
    restaurantSpecialDays,
    defaultSlotDuration,
  ]);

  const handleFindTables = async () => {
    const params = {
      time: selectedTimeSlot,
      party_size: Number(partySize),
      is_smoker: isSmoker,
      duration: Number(duration),
      day: day,
      date: selectedDate.toISOString().split("T")[0],
    };

    onChangeLoading(true);

    try {
      const response = await api.get(
        `api/restaurants-availability/${restaurantId}/`,
        { params }
      );

      console.log(response.data);

      const combinedTables = [
        ...response.data.tables.map((table) => ({ ...table, available: true })),
        ...response.data.unavailable.map((table) => ({
          ...table,
          available: false,
        })),
      ];

      onChangeReservationTablesData({
        tables: combinedTables,
        reservationDetails: params,
      });

      onChangeViewForm("tables");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      onChangeLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- Header with Back Button --- */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => onChangeViewForm("calendar")}
            className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Reservation Details
          </h1>
        </div>

        {/* --- Summary of Selection --- */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg mb-8 flex items-center">
          <Calendar className="w-5 h-5 mr-3" />
          <p className="font-semibold">
            Your selected slot:{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedTimeSlot}
          </p>
        </div>

        {/* --- Form Sections --- */}
        <div className="space-y-6">
          {/* 1. Party Size */}
          <InfoSection
            icon={<Users className="w-6 h-6 text-amber-600" />}
            title="How many people?"
          >
            <select
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="" disabled>
                Select party size...
              </option>
              {[...Array(8).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} person{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </InfoSection>

          {/* 2. Smoker Preference */}
          <InfoSection
            icon={<Cigarette className="w-6 h-6 text-amber-600" />}
            title="Smoking Preference"
          >
            <label className="flex items-center w-full p-3 bg-gray-50 border border-gray-300 rounded-md cursor-pointer">
              <input
                type="checkbox"
                checked={isSmoker}
                onChange={(e) => setIsSmoker(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="ml-3 text-gray-700">
                Request a table in the smoking section
              </span>
            </label>
          </InfoSection>

          {/* 3. Duration */}
          <InfoSection
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            title="How long will you stay?"
          >
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              disabled={durationOptions.length === 0}
            >
              <option value="" disabled>
                Select duration...
              </option>
              {durationOptions.map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </InfoSection>
        </div>

        {/* --- Action Button --- */}
        <div className="mt-8">
          <button
            onClick={handleFindTables}
            disabled={!isFormComplete}
            className="w-full flex items-center justify-center px-8 py-4 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Tables
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationBookingDetails;
