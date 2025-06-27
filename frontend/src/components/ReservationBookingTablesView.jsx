import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../api/api";
import RestaurantFormTableConfigurationCanvas from "./RestaurantFormTableConfigurationCanvas";

function ReservationBookingTablesView({
  reservationTablesData = {},
  onChangeViewForm,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const { tables, reservationDetails } = reservationTablesData;

  const [currentRestaurantTables, setCurrentRestaurantTables] =
    useState(tables);

  const reservationPayloadTime = reservationDetails["time"];
  const reservationPayloadDuration = reservationDetails["duration"];

  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const handleCanvasResize = ({ width, height }) => {
    const oldSize = canvasSizeRef.current;
    if (
      oldSize.width === 0 ||
      (oldSize.width === width && oldSize.height === height)
    ) {
      return;
    }
    const scaleX = width / oldSize.width;
    const scaleY = height / oldSize.height;

    const scaleTable = (table) => ({
      ...table,
      x_position: table.x_position * scaleX,
      y_position: table.y_position * scaleY,
      width:
        table.shape.toLowerCase() === "rectangle"
          ? table.width * scaleX
          : table.width,
      height:
        table.shape.toLowerCase() === "rectangle"
          ? table.height * scaleY
          : table.height,
      radius:
        table.shape.toLowerCase() === "circle"
          ? table.radius * ((scaleX + scaleY) / 2)
          : table.radius,
    });

    const scaledTables = tables.map(scaleTable);

    const newRestaurantTables = scaledTables;

    setCurrentRestaurantTables(newRestaurantTables);

    canvasSizeRef.current = { width, height };
  };

  const handleFinalizeReservation = async () => {
    if (!selectedTableId) {
      toast.error("Please select a table first.");
      return;
    }

    setIsLoading(true);
    try {
      const reservationData = {
        start_time: reservationPayloadTime,
        date: reservationDetails["date"],
        duration: reservationPayloadDuration,
        table_id: selectedTableId,
      };

      const response = await api.post(
        `/api/reservations/create-reservation/`,
        reservationData
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Reservation successful!");

        navigate("/confirm-booking", {
          state: {
            message: response.data.message,
            reservation_id: response.data.reservation_id,
            restaurant_id: response.data.restaurant_id,
          },
        });
      } else {
        toast.error(response.data.message || "Failed to make reservation.");
      }
    } catch (error) {
      console.error("Error making reservation:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const tablesOnCanvas = useMemo(() => {
    return currentRestaurantTables.map((table) => ({
      ...table,
      x: table.x_position,
      y: table.y_position,
      shape: table.shape ? table.shape.toLowerCase() : "rectangle",

      isBookable: table.available, // A table is "bookable" if the API said it's available
      isSelected: table.id === selectedTableId, 
    }));
  }, [currentRestaurantTables, selectedTableId]);

  const handleCanvasTableSelect = useCallback(
    (pos, eventType) => {
      if (eventType !== "down" || !pos) return;

      const clickedTable = [...tablesOnCanvas].reverse().find((table) => {
        if (table.shape === "circle") {
          const distance = Math.sqrt(
            Math.pow(pos.x - table.x, 2) + Math.pow(pos.y - table.y, 2)
          );

          return distance < table.radius;
        } else {
          return (
            pos.x >= table.x &&
            pos.x <= table.x + table.width &&
            pos.y >= table.y &&
            pos.y <= table.y + table.height
          );
        }
      });

      if (clickedTable) {
        if (clickedTable.isBookable) {
          setSelectedTableId((prevId) =>
            prevId === clickedTable.id ? null : clickedTable.id
          );
        } else {
          toast.error(
            "This table is unavailable for the selected time and duration."
          );
        }
      }
    },

    [tablesOnCanvas]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-screen">
        <header className="flex-shrink-0">
          <div className="flex items-center mb-6">
            <button
              onClick={() => onChangeViewForm("details")}
              className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Select a Table</h1>
          </div>
        </header>

        <main className="flex-grow bg-white border border-gray-200 rounded-lg shadow-inner overflow-hidden relative p-4">
          <div className="w-full h-full relative">
            <RestaurantFormTableConfigurationCanvas
              tables={tablesOnCanvas}
              onTableSelect={handleCanvasTableSelect}
              onTableMove={() => {}}
              onResize={handleCanvasResize}
            />
          </div>
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-3 rounded-lg border text-sm">
            <h4 className="font-bold mb-2">Legend</h4>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-600 ring-2 ring-green-300 mr-2"></div>
              <span>Selected</span>
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 pt-6">
          <button
            onClick={handleFinalizeReservation}
            disabled={!selectedTableId || isLoading}
            className="w-full px-6 py-3 font-semibold text-lg text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Processing..." : "Finalize Reservation"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ReservationBookingTablesView;
