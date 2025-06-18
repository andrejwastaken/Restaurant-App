// src/pages/AvailableTablesPage.js (or wherever you store your page components)

import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, CheckCircle, XCircle } from "lucide-react";

// A simple component for displaying a table
const TableCard = ({ table, isAvailable, onBook }) => (
    <div
        className={`p-4 rounded-lg shadow-md border ${
            isAvailable 
                ? 'bg-white border-gray-200' 
                : 'bg-gray-100 border-gray-300 opacity-60'
        }`}
    >
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>Capacity: </span>
            </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
            ID: {table.id} | Shape: 
        </div>
        {isAvailable && (
            <button
                onClick={() => onBook(table.id)}
                className="mt-4 w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
                Book This Table
            </button>
        )}
    </div>
);


function AvailableTablesPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Guard clause: If someone lands on this page directly, the state will be null.
    // In that case, redirect them back to the home page or previous page.
    if (!location.state) {
        // You can navigate to a specific fallback route if needed
        // navigate('/'); 
        return (
            <div className="text-center p-8">
                <h1 className="text-xl font-bold">No data found.</h1>
                <p>Please start by finding a reservation.</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }
    
    // Destructure the data from the location state for easy access
    const { availableTables, unavailableTables, reservationDetails } = location.state;

    const handleBookTable = (tableId) => {
        // Here you would implement the final booking logic
        console.log("Booking table ID:", tableId);
        console.log("With reservation details:", reservationDetails);
        alert(`Booking functionality for table ${tableId} would be implemented here!`);
        // Example: navigate('/confirm-booking', { state: { tableId, reservationDetails } });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* --- Header with Back Button --- */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 mr-4 text-gray-600 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Available Tables
                    </h1>
                </div>

                {/* --- Available Tables Section --- */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-700">Found {availableTables.length} available table(s)</h2>
                    </div>
                    {availableTables.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableTables.map((table) => (
                                <TableCard key={table.id} table={table} isAvailable={true} onBook={handleBookTable} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-lg border">
                            <p className="text-gray-600">No tables are available that match your exact criteria.</p>
                        </div>
                    )}
                </div>

                {/* --- Unavailable Tables Section --- */}
                {unavailableTables.length > 0 && (
                     <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <XCircle className="w-6 h-6 text-red-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-700">Unavailable due to booking conflicts</h2>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unavailableTables.map((table) => (
                                <TableCard key={table.id} table={table} isAvailable={false} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AvailableTablesPage;