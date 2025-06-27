import { useRef, useState } from "react";

import RestaurantFormTableConfigurationCanvas from "./RestaurantFormTableConfigurationCanvas";
import RestaurantFormTableConfigurationSidebar from "./RestaurantFormTableConfigurationSidebar";
import RestaurantFormTableConfigurationSidebarTableType from "./RestaurantFormTableConfigurationSidebarTableType";
import { useProfileData } from "../contexts/ProfileDataContext";
import toast from "react-hot-toast";
import RestaurantFormTableSetup from "./RestaurantFormTableSetup";


function checkRectVsRect(rect1, rect2) {
  if (!rect1 || !rect2 || rect1.width <= 0 || rect2.width <= 0) return false;
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function checkCircleVsCircle(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

function checkRectVsCircle(rect, circle) {
  // Find the closest point on the rectangle to the center of the circle
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // Calculate the distance between the circle's center and this closest point
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // If the distance is less than the circle's radius, an intersection occurs
  return distanceSquared < circle.radius * circle.radius;
}

const checkCollision = (table1, table2) => {
  if (!table1 || !table2) return false;

  // Case 1: Rectangle vs Rectangle
  if (table1.shape === "rectangle" && table2.shape === "rectangle") {
    return checkRectVsRect(table1, table2);
  }
  // Case 2: Circle vs Circle
  if (table1.shape === "circle" && table2.shape === "circle") {
    return checkCircleVsCircle(table1, table2);
  }
  // Case 3: Rectangle vs Circle (and vice-versa)
  if (table1.shape === "rectangle" && table2.shape === "circle") {
    return checkRectVsCircle(table1, table2);
  }
  if (table1.shape === "circle" && table2.shape === "rectangle") {
    return checkRectVsCircle(table2, table1); // Reuse the function by swapping args
  }
  return false; // Default case if shapes are undefined
};

function RestaurantFormTableConfiguration() {
  const { addRestaurantData, handleSaveAddRestaurantItem } = useProfileData();
  const { tableTypesInformation, tablesInformation } = addRestaurantData;

  const [isAddingTableType, setIsAddingTableType] = useState(false);

  const [pendingTable, setPendingTable] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      x: table.x * scaleX,
      y: table.y * scaleY,
      width: table.shape === "rectangle" ? table.width * scaleX : table.width,
      height:
        table.shape === "rectangle" ? table.height * scaleY : table.height,
      radius:
        table.shape === "circle"
          ? table.radius * ((scaleX + scaleY) / 2)
          : table.radius,
    });

    const scaledTables = tablesInformation.map(scaleTable);
    handleSaveAddRestaurantItem({ tablesInformation: scaledTables });

    if (pendingTable) {
      setPendingTable(scaleTable(pendingTable));
    }

    canvasSizeRef.current = { width, height };
  };

  const handleTableSelect = (pos, eventType) => {
    if (eventType === "down") {
      // Table type must be made before making the table configuration
      if (!tableTypesInformation || tableTypesInformation.length === 0) {
        toast.error(
          "Table type must be made before making the table configuration!"
        );
        return;
      }

      let clickedTable = null;

      // First, check if the click is on the current pending table
      if (pendingTable) {
        const table = pendingTable;
        if (table.shape === "circle") {
          const distance = Math.sqrt(
            (pos.x - table.x) ** 2 + (pos.y - table.y) ** 2
          );
          if (distance < table.radius) clickedTable = table;
        } else {
          if (
            pos.x >= table.x &&
            pos.x <= table.x + table.width &&
            pos.y >= table.y &&
            pos.y <= table.y + table.height
          ) {
            clickedTable = table;
          }
        }
      }

      // If not clicking the pending table, check saved tables
      if (!clickedTable) {
        clickedTable = tablesInformation.find((table) => {
          if (table.shape === "circle") {
            const distance = Math.sqrt(
              (pos.x - table.x) ** 2 + (pos.y - table.y) ** 2
            );
            return distance < table.radius;
          }
          return (
            pos.x >= table.x &&
            pos.x <= table.x + table.width &&
            pos.y >= table.y &&
            pos.y <= table.y + table.height
          );
        });
      }

      if (clickedTable) {
        // If we clicked on a table that is *not* the current pending one, switch to it.
        if (!pendingTable || pendingTable.id !== clickedTable.id) {
          if (pendingTable) {
            toast.error(
              "Save or cancel the current table before editing another.",
              { id: "finish-edit-toast" }
            );
            return;
          }
          setPendingTable({ ...clickedTable, isPending: true });
        }
        setIsDragging(true);
        setDragOffset({ x: pos.x - clickedTable.x, y: pos.y - clickedTable.y });
      } else {
        if (pendingTable) return; // Clicked blank space while a table is pending, do nothing.

        // Clicked on blank space, create a new table
        const newTable = {
          id: `pending-${Date.now()}`,
          name: "",
          table_type: "",
          shape: "rectangle",
          x: pos.x - 40,
          y: pos.y - 60,
          width: 80,
          height: 120,
          radius: 50,
          isPending: true,
        };
        setPendingTable(newTable);
        setIsDragging(true);
        setDragOffset({ x: 40, y: 60 });
      }
    } else if (eventType === "up") {
      setIsDragging(false);
    }
  };

  const handleTableMove = (pos) => {
    if (!isDragging || !pendingTable) return;

    const newX = pos.x - dragOffset.x;
    const newY = pos.y - dragOffset.y;

    const futurePos = { ...pendingTable, x: newX, y: newY };
    const isOverlapping = tablesInformation
      .filter((t) => t.id !== pendingTable.id)
      .some((t) => checkCollision(futurePos, t));

    if (isOverlapping) {
      toast.error("Tables cannot overlap!", {
        id: "overlap-toast",
        duration: 1500,
      });
      return;
    }
    setPendingTable((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handlePendingDataChange = (name, value) => {
    if (!pendingTable) return;
    setPendingTable((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!pendingTable) return;

    if (!pendingTable.name || pendingTable.name.trim() === "") {
      toast.error("A table must have a name.");
      return;
    }

    const nameExists = tablesInformation.some(
      (table) =>
        table.name.toLowerCase() === pendingTable.name.toLowerCase() &&
        table.id !== pendingTable.id
    );

    if (nameExists) {
      toast.error(
        "A table with this name already exists. Please choose a different name."
      );
      return;
    }

    if (!pendingTable.table_type || pendingTable.table_type.trim() === "") {
      toast.error("A table must have a type selected.");
      return;
    }

    const { isPending, ...tableToSave } = pendingTable;
    const existingIndex = tablesInformation.findIndex(
      (t) => t.id === tableToSave.id
    );
    let newTables;
    if (existingIndex > -1) {
      newTables = [...tablesInformation];
      newTables[existingIndex] = tableToSave;
    } else {
      newTables = [
        ...tablesInformation,
        { ...tableToSave, id: `table-${Date.now()}` },
      ];
    }

    handleSaveAddRestaurantItem({ tablesInformation: newTables });
    setPendingTable(null);
    toast.success("Table saved!");
  };

  const handleDelete = () => {
    if (!pendingTable || pendingTable.id.toString().startsWith("pending-"))
      return;
    const newTables = tablesInformation.filter((t) => t.id !== pendingTable.id);
    handleSaveAddRestaurantItem({ tablesInformation: newTables });
    setPendingTable(null);
    toast.success("Table deleted.");
  };

  const handleReturn = () => {
    setPendingTable(null);
    setIsDragging(false);
    setIsAddingTableType(false);
  };

  const handleAddTableTypeClick = () => {
    setIsAddingTableType(true);
  };

  const handleTableTypesInformation = (newData) => {
    const nameExists = (tableTypesInformation || []).some(
      (type) => type.name.toLowerCase() === newData.name.toLowerCase()
    );

    if (nameExists) {
      toast.error("Cannot add the same table type name twice");
      return;
    }

    const capacityExists = (tableTypesInformation || []).some(
      (type) => parseInt(type.capacity, 10) === parseInt(newData.capacity, 10)
    );

    if (capacityExists) {
      toast.error("Cannot add the same table type capacity twice");
      return;
    }

    const updatedTableTypes = [...(tableTypesInformation || []), newData];
    handleSaveAddRestaurantItem({ tableTypesInformation: updatedTableTypes });

    toast.success("Table type successfully added");
    setIsAddingTableType(false);
  };

  const handleRemoveTableType = (newData) => {
    handleSaveAddRestaurantItem({ tableTypesInformation: newData });
  };

  const tablesOnCanvas = pendingTable
    ? [
        ...tablesInformation.filter((t) => t.id !== pendingTable.id),
        pendingTable,
      ]
    : tablesInformation;

  return (
    <div className="w-full h-full flex justify-between space-x-4">
      <div className="w-3/4">
        <RestaurantFormTableConfigurationCanvas
          tables={tablesOnCanvas}
          onTableSelect={handleTableSelect}
          onTableMove={handleTableMove}
          onResize={handleCanvasResize}
        />
      </div>

      <div className="w-1/4 h-full min-h-0 flex flex-col">
        {isAddingTableType ? (
          <RestaurantFormTableConfigurationSidebarTableType
            onReturn={handleReturn}
            onSave={handleTableTypesInformation}
          />
        ) : pendingTable ? (
          <RestaurantFormTableSetup
            tableData={pendingTable}
            tableTypes={tableTypesInformation}
            onDataChange={handlePendingDataChange}
            onDelete={handleDelete}
            onSave={handleSave}
            onReturn={handleReturn}
          />
        ) : (
          <RestaurantFormTableConfigurationSidebar
            tableTypes={tableTypesInformation}
            onAddTableType={handleAddTableTypeClick}
            onRemoveTableType={handleRemoveTableType}
          />
        )}
      </div>
    </div>
  );
}

export default RestaurantFormTableConfiguration;
