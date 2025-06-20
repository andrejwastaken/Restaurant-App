import { useEffect, useRef } from "react";

function RestaurantFormTableConfigurationCanvas({
  tables,
  onTableMove,
  onTableSelect,
  onResize,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // Only call onResize if the size has actually changed to avoid infinite loops
      if (canvas.width !== width || canvas.height !== height) {
        onResize({ width, height });
      }
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.unobserve(canvas);
  }, [onResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    (tables || []).forEach((table) => {
      const isPending = table.isPending;
      const isAvailable = table.isAvailable; // Check if the table is available

      // *** MODIFIED LOGIC ***
      // Set the fill and stroke styles based on the table's state.
      // 'available' tables are now drawn in green.
      if (isAvailable) {
        context.fillStyle = "rgba(34, 197, 94, 0.7)"; // A nice, slightly transparent green
        context.strokeStyle = "rgb(22, 163, 74)"; // A darker green for the border
        context.lineWidth = 2;
      } else if (isPending) {
        context.fillStyle = "rgba(59, 130, 246, 0.5)";
        context.strokeStyle = "rgb(37, 99, 235)";
        context.lineWidth = 2;
      } else {
        context.fillStyle = "#F0F0F0"; // Default style
        context.strokeStyle = "black";
        context.lineWidth = 1;
      }

      if (table.shape.toLowerCase() === "circle") {
        context.beginPath();
        context.arc(table.x, table.y, table.radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      } else {
        context.fillRect(table.x, table.y, table.width, table.height);
        context.strokeRect(table.x, table.y, table.width, table.height);
      }
    });
  }, [tables]);

  const getMousePos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => onTableSelect(getMousePos(e), "down");
  const handleMouseMove = (e) => onTableMove(getMousePos(e));
  const handleMouseUp = (e) => onTableSelect(getMousePos(e), "up");

  return (
    <div className="w-full h-full flex justify-center items-center">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full border-2 border-gray-300 rounded-md shadow-sm bg-white"
      ></canvas>
    </div>
  );
}

export default RestaurantFormTableConfigurationCanvas;
