import { useEffect, useRef, useState } from "react";

const initialEmptyTable = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

function RestaurantFormTableConfigurationCanvas({
  tables,
  onTableMove,
  onTableSelect,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    (tables || []).forEach((table) => {
      const isPending = table.isPending;
      context.fillStyle = isPending ? "rgba(59, 130, 246, 0.5)" : "#F0F0F0";
      context.strokeStyle = isPending ? "rgb(37, 99, 235)" : "black";
      context.lineWidth = isPending ? 2 : 1;

      if (table.shape === "circle") {
        context.beginPath();
        context.arc(table.x, table.y, table.radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      } else {
        // rectangle
        context.fillRect(table.x, table.y, table.width, table.height);
        context.strokeRect(table.x, table.y, table.width, table.height);
      }
    });

    return () => window.removeEventListener("resize", resizeCanvas);
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
