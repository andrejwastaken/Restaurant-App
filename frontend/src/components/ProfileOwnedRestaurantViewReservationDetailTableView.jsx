import { useMemo, useRef, useState, useEffect } from "react";
import { useProfileData } from "../contexts/ProfileDataContext";
import { useParams } from "react-router-dom";

import RestaurantFormTableConfigurationCanvas from "./RestaurantFormTableConfigurationCanvas";

function ProfileOwnedRestaurantViewReservationDetailTableView() {
  const { currentOwnedRestaurant } = useProfileData();
  const { reservationId } = useParams();

  const reservation = useMemo(
    () =>
      currentOwnedRestaurant?.setup?.reservations?.find(
        (res) => String(res.id) === reservationId
      ) || null,
    [currentOwnedRestaurant, reservationId]
  );

  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const handleCanvasResize = ({ width, height }) => {
    const oldSize = canvasSizeRef.current;
    if (
      oldSize.width === 0 ||
      (oldSize.width === width && oldSize.height === height)
    ) {
      canvasSizeRef.current = { width, height };
      return;
    }
    canvasSizeRef.current = { width, height };
  };

  const tablesOnCanvas = useMemo(() => {
    const allTables = currentOwnedRestaurant?.setup?.tables || [];
    const reservedTable = reservation?.table || null;

    if (!reservedTable) return [];

    const baseTables = allTables.filter((t) => t.id !== reservedTable.id);

    const transformedTables = baseTables.map((table) => ({
      ...table,
      x: table.x_position,
      y: table.y_position,
      shape: table.shape ? table.shape.toLowerCase() : "rectangle",
    }));

    return [
      ...transformedTables,
      {
        ...reservedTable,
        shape: reservedTable.shape.toLowerCase(),
        x: reservedTable.x_position,
        y: reservedTable.y_position,
        isAvailable: true,
      },
    ];
  }, [currentOwnedRestaurant, reservation]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow min-h-0 flex justify-between space-x-4">
        <RestaurantFormTableConfigurationCanvas
          tables={tablesOnCanvas}
          onTableSelect={() => {}}
          onTableMove={() => {}}
          onResize={handleCanvasResize}
        />
      </div>
    </div>
  );
}

export default ProfileOwnedRestaurantViewReservationDetailTableView;
