import { useState, useEffect } from "react";

function ModalShell({ title, children, onClose }) {
  // State to control the visibility for the animation
  const [isShowing, setIsShowing] = useState(false);

  // Trigger the animation when the component mounts
  useEffect(() => {
    // A tiny delay allows the browser to render the initial (invisible) state
    // before the transition starts, ensuring the animation plays correctly.
    const timer = setTimeout(() => {
      setIsShowing(true);
    }, 10); // 10ms is enough

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsShowing(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      className={`fixed inset-0 bg-black flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out ${
        isShowing ? "bg-opacity-60" : "bg-opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col transform transition-all duration-300 ease-out ${
          isShowing ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 text-3xl leading-none font-semibold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>

        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="modal-form"
              className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalShell;
