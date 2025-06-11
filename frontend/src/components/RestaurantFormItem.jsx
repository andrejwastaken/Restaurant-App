function RestaurantFormItem({ item, name, checkState }) {
  const isArray = Array.isArray(checkState) ? true : false;

  function renderItem() {
    if (isArray) {
      if (!Array.isArray(item) || item.length === checkState.length) {
        return <span className="italic text-gray-400">Empty</span>;
      }

      return <div className="italic text-gray-500">Configuration filled</div>;
    } else {
      if (item === checkState) {
        return <span className="italic text-gray-400">Empty</span>;
      }

      if (typeof item === "object") {
        const allEmpty = Object.values(item).every(
          (val) => Array.isArray(val) && val.length === 0
        );

        if (allEmpty) {
          return <span className="italic text-gray-400">Empty</span>;
        }

        return <span className="italic text-gray-500">Time slots filled</span>;
      }

      return <span className="italic text-gray-500">{item}</span>;
    }
  }

  return (
    <div className="flex justify-between text-sm text-gray-700">
      <span className="font-medium">{name}:</span>
      <span>{renderItem()}</span>
    </div>
  );
}

export default RestaurantFormItem;
