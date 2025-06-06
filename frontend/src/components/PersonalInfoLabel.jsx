function PersonalInfoLabel({ label, content, handleClick }) {
  return (
    <div className="flex items-center h-16 border-b border-gray-300 justify-between">
      <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider mr-2">
        {label}:
      </p>

      <button
        onClick={handleClick}
        class="text-[15px] text-blue-500 font-medium focus:outline-none hover:text-blue-700"
      >
        {content}
      </button>
    </div>
  );
}

export default PersonalInfoLabel;
