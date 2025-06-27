import { useEffect, useState } from "react";

function ModalCanvasShell({ children, onClose, label, width }) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(function () {
    const timer = setTimeout(() => {
      setIsShowing(true);
    }, 10);
  }, []);

  const handleClose = () => {
    setIsShowing(false);

    setTimeout(() => {
      setIsShowing(false);

      setTimeout(() => {
        onClose();
      });
    }, 300);
  };

  const handleContentClick = (e) => e.stopPropagation();

  return (
    // Backdrop overlay
    <div
      className={`z-[9999] fixed inset-0 bg-black flex justify-center items-center p-4 transition-opacity duration-300 ease-out ${
        isShowing ? "bg-opacity-60" : "bg-opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-${width}xl h-[95vh] flex flex-col transform transition-all duration-300 ease-out ${
          isShowing ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{label}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 text-3xl leading-none font-semibold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow p-4 overflow-hidden h-full">{children}</div>
      </div>
    </div>
  );
}

export default ModalCanvasShell;
