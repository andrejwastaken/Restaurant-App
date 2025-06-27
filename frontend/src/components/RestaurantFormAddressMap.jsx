import RestaurantLocationPicker from "./Map";

function RestaurantFormAddressMap({ currentAddress, onPositionChange }) {
  return (
    <div className="w-full h-full">
      <RestaurantLocationPicker
        position={[currentAddress.latitude, currentAddress.longitude]}
        onPositionChange={onPositionChange}
      />
    </div>
  );
}

export default RestaurantFormAddressMap;
