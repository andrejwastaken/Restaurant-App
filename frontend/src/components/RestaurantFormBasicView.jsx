import { useState } from "react";

import ProfileMenuContentTitle from "./ProfileMenuContentTitle";
import RestaurantFormBasicViewContent from "./RestaurantFormBasicViewContent";
import toast from "react-hot-toast";
import api from "../api/api";
import RestaurantLocationPicker from "../components/Map"; 

function RestaurantFormBasicView({ basicInformation, onSave, onReturn }) {
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

	const [currentBasicInformation, setCurrentBasicInformation] = useState(
		basicInformation
			? basicInformation
			: {
					name: "",
					description: "",
					address: "",
					phone_number: "",
					latitude: 41.9981, // Default to Skopje's center
					longitude: 21.4254,
					default_reservation_slot_duration: "",
			  }
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "default_reservation_slot_duration" && value < 0) {
			return;
		}
		setCurrentBasicInformation((prevInfo) => ({
			...prevInfo,
			[name]: value,
		}));
	};

	const handleSaveClick = () => {
		if (!currentBasicInformation.name || !currentBasicInformation.address) {
			toast.error("Restaurant name and address are required.");
			return;
		}
		onSave({ basicInformation: currentBasicInformation });
		onReturn();
	};

	const handleGeocode = async () => {
		if (!currentBasicInformation.address) {
			toast.error("Please enter an address first.");
			return;
		}
		setIsGeocoding(true);
		try {
			const response = await api.post("api/geocode/", {
				address: currentBasicInformation.address,
			});
			const { latitude, longitude } = response.data;
			setCurrentBasicInformation((prev) => ({ ...prev, latitude, longitude }));
		} catch (error) {
			console.error("Geocoding failed", error);
			toast.error(
				"Failed to geocode address. Please check the address and try again."
			);
		} finally {
			setIsGeocoding(false);
		}
	};

	const handlePositionChange = async (lat, lng) => {
		// Optimistically update coordinates in state
		setCurrentBasicInformation((prev) => ({
			...prev,
			latitude: lat,
			longitude: lng,
		}));

		setIsReverseGeocoding(true);
		try {
			const response = await api.post("api/reverse-geocode/", {
				latitude: lat,
				longitude: lng,
			});
			let { address } = response.data;
			const formatted_address = address.split(",").slice(0, 2);
			address = formatted_address[1].trim() + " " + formatted_address[0].trim();
			address = address.trim();
			if (address) {
				setCurrentBasicInformation((prev) => ({ ...prev, address: address }));
			} else {
				toast.error("No address found for this location.");
			}
		} catch (error) {
			console.error("Reverse geocoding failed", error);
			toast.error(
				"Failed to retrieve address. Please try a different location."
			);
		} finally {
			setIsReverseGeocoding(false);
		}
	};

	return (
		<div className="w-full h-screen p-6 flex flex-col">
			<div className="flex-1 overflow-y-auto pr-2">
				<ProfileMenuContentTitle label="Basic Information" />
				<RestaurantFormBasicViewContent
					name={currentBasicInformation.name}
					description={currentBasicInformation.description}
					address={
						isReverseGeocoding
							? "Fetching address..."
							: currentBasicInformation.address
					}
					phone_number={currentBasicInformation.phone_number}
					default_reservation_slot_duration={
						currentBasicInformation.default_reservation_slot_duration
					}
					onChange={handleChange}
				/>

				<div className="pt-24">
					<h3 className="text-lg text-center font-semibold text-gray-700 mb-3">
						Set Restaurant Location
					</h3>
					<div className="mb-4">
						<button
							onClick={handleGeocode}
							disabled={isGeocoding}
							className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none disabled:bg-gray-400"
						>
							{isGeocoding ? "Finding..." : "Find Address on Map"}
						</button>
					</div>
					<div className="w-full h-96">
						{" "}
						<RestaurantLocationPicker
							position={[
								currentBasicInformation.latitude,
								currentBasicInformation.longitude,
							]}
							onPositionChange={handlePositionChange}
						/>
					</div>
				</div>
			</div>

			<div className="flex space-x-4 pt-4">
				<button
					className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
					onClick={onReturn}
				>
					Return
				</button>
				<button
					className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none"
					onClick={handleSaveClick}
				>
					Save
				</button>
			</div>
		</div>
	);
}

export default RestaurantFormBasicView;
