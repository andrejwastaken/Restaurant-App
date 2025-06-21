import { useState } from "react"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Calendar, Clock, Tag, Loader2 } from "lucide-react";
import api from "../api/api"; 
import { toast } from "react-hot-toast"; 

const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
        date: date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        }),
    };
};

function ReservationQrPage() {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [isCancelling, setIsCancelling] = useState(false);

    const reservation = location.state?.reservation;
    const restaurantId = location.state?.restaurant_id;

    if (!reservation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Reservation Not Found
                </h2>
                <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
                </button>
            </div>
        );
    }

    const { date, time } = formatDateTime(reservation.start_time);
    const qrCodeValue = `http://localhost:3000/user/owned-restaurants/${restaurantId}/reservations/${reservationId}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeValue)}&ecc=H&margin=10`;

    const handleDecline = async () => {
        if (!window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
            return;
        }

        setIsCancelling(true); 
        try {
            await api.delete(`/api/reservations/${reservationId}/cancel/`);
            toast.success("Reservation cancelled successfully!");
            navigate("/user/your-reservations"); 

        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to cancel reservation. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsCancelling(false); 
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-6 relative">

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    <h1 className="text-2xl font-bold text-gray-800 mt-4">Reservation Confirmed</h1>
                    <p className="text-md text-gray-500">Show this QR code upon arrival.</p>
                </div>
                <div className="flex justify-center">
                    <div className="p-2 bg-white rounded-lg border-2 border-gray-300 shadow-inner">
                        <img src={qrCodeApiUrl} alt="Reservation QR Code" width="250" height="250" />
                    </div>
                </div>
                <div className="space-y-4 text-gray-700 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between"><span className="font-semibold flex items-center"><Tag className="w-5 h-5 mr-3 text-amber-500"/>Table</span><span className="font-mono bg-gray-100 px-3 py-1 rounded-md text-sm font-semibold">{reservation.table.name}</span></div>
                    <div className="flex items-center justify-between"><span className="font-semibold flex items-center"><Calendar className="w-5 h-5 mr-3 text-amber-500"/>Date</span><span>{date}</span></div>
                    <div className="flex items-center justify-between"><span className="font-semibold flex items-center"><Clock className="w-5 h-5 mr-3 text-amber-500"/>Arrival Time</span><span>{time}</span></div>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                     <button
                        className="flex-1 text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        onClick={() => navigate(-1)}
                    >
                        Return
                    </button>
                    <button
                        className="flex-1 text-center py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center"
                        onClick={handleDecline}
                        disabled={isCancelling} 
                    >
                        {isCancelling ? (
                            <Loader2 className="w-5 h-5 animate-spin" /> 
                        ) : (
                            "Decline Reservation"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservationQrPage;