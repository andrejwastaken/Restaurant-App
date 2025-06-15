import { useEffect, useRef, useState } from "react";

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
      context.fillStyle = isPending ? "rgba(59, 130, 246, 0.5)" : "#F0F0F0";
      context.strokeStyle = isPending ? "rgb(37, 99, 235)" : "black";
      context.lineWidth = isPending ? 2 : 1;
      if (table.shape === "circle") {
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
