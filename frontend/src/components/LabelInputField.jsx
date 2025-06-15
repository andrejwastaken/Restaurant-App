function LabelInputField({ label, type, value, name, onChange }) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          name={name}
          className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          autoFocus
        />
      </div>
    </div>
  );
}

export default LabelInputField;
