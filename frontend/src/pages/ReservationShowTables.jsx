import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import api from "../api/api"; // Assuming your api utility is in this path
import { toast } from "react-hot-toast";

const CanvasTable = ({ table, isUnavailable, isSelected, onSelect }) => {
    const baseClasses = "absolute rounded-md w-16 h-16 flex items-center justify-center font-semibold text-white shadow-lg transform transition-all duration-200";
    const stateClasses = isUnavailable
        ? 'bg-red-500'
        : isSelected
            ? 'bg-green-600 ring-4 ring-green-300 scale-110'
            : 'bg-gray-500 hover:bg-gray-600 cursor-pointer';

    return (
        <div
            style={{
                left: `${table.x_position}px`,
                top: `${table.y_position}px`,
            }}
            className={`${baseClasses} ${stateClasses}`}
            onClick={() => !isUnavailable && onSelect(table.id)}
            title={isUnavailable ? `${table.name} (Unavailable)` : `Click to select ${table.name}`}
        >
            {table.name}
        </div>
    );
};


function AvailableTablesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { id: restaurantId } = useParams(); 
    
    const { availableTables, unavailableTables, reservationDetails } = location.state;
    const handleSelectTable = (tableId) => {
        setSelectedTableId(prevSelectedId => prevSelectedId === tableId ? null : tableId);
    };

    const handleFinalizeReservation = async () => {
        if (!selectedTableId) {
            toast.error("Please select a table first.");
            return;
        }

        setIsLoading(true);
        try {
            const reservationData = {
                ...reservationDetails, 
                table_id: selectedTableId,
                restaurant_id: restaurantId,
            };
            
            const response = await api.post(`/reservations`, reservationData);

            if (response.status === 200 || response.status === 201) {
                toast.success("Reservation successful!");
                navigate('/confirm-booking', { state: { reservationDetails: response.data } });
            } else {
                toast.error(response.data.message || "Failed to make reservation.");
            }
        } catch (error) {
            console.error("Error making reservation:", error);
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-screen">
                <header className="flex-shrink-0">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Select a Table
                        </h1>
                    </div>
                </header>

                <main className="flex-grow bg-white border border-gray-200 rounded-lg shadow-inner overflow-hidden relative p-4">
                    <div className="w-full h-full relative"> 
                        {availableTables.map((table) => (
                            <CanvasTable
                                key={table.id}
                                table={table}
                                isUnavailable={false}
                                isSelected={selectedTableId === table.id}
                                onSelect={handleSelectTable}
                            />
                        ))}
                        {unavailableTables.map((table) => (
                            <CanvasTable
                                key={table.id}
                                table={table}
                                isUnavailable={true}
                            />
                        ))}
                    </div>
                     <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-3 rounded-lg border text-sm">
                        <h4 className="font-bold mb-2">Legend</h4>
                        <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div><span>Available</span></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div><span>Unavailable</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-green-600 ring-2 ring-green-300 mr-2"></div><span>Selected</span></div>
                    </div>
                </main>


                <footer className="flex-shrink-0 pt-6">
                    <button
                        onClick={handleFinalizeReservation}
                        disabled={!selectedTableId || isLoading}
                        className="w-full px-6 py-3 font-semibold text-lg text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? 'Processing...' : 'Finalize Reservation'}
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default AvailableTablesPage;