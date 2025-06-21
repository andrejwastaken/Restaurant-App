import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    ArrowLeft,
    Star, 
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const formatDateToYYYYMMDD = (date) => {
    return date.toISOString().split("T")[0];
};

function RestaurantsCalendar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { id } = useParams();

    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const restaurantTimeSlot = state?.restaurantTimeSlot || 30;
    const restaurantOperatingHours = useMemo(
        () =>
            state?.restaurantOperatingHours || [
                { day_of_week: 3, open_time: "09:00:00", close_time: "17:00:00" },
            ],
        [state?.restaurantOperatingHours]
    );
    const restaurantSpecialDays = useMemo(
        () => state?.restaurantSpecialDays || [],
        [state?.restaurantSpecialDays]
    );

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const operatingHoursMap = useMemo(() => {
        const map = {};
        restaurantOperatingHours.forEach((hours) => {
            map[hours.day_of_week] = {
                open: hours.open_time,
                close: hours.close_time,
            };
        });
        return map;
    }, [restaurantOperatingHours]);

    const specialDaysMap = useMemo(() => {
        const map = {};
        restaurantSpecialDays.forEach((specialDay) => {
            map[specialDay.day] = {
                open: specialDay.open_time,
                close: specialDay.close_time,
                description: specialDay.description,
            };
        });
        return map;
    }, [restaurantSpecialDays]);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const getSpecialDayInfo = useCallback(
        (date) => {
            const dateString = formatDateToYYYYMMDD(date);
            return specialDaysMap[dateString] || null;
        },
        [specialDaysMap]
    );

    const isOperatingDay = useCallback(
        (date) => {
            if (getSpecialDayInfo(date)) {
                return true; 
            }
            const dayOfWeek = date.getDay();
            const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            return Object.prototype.hasOwnProperty.call(operatingHoursMap, mondayBasedDay);
        },
        [operatingHoursMap, getSpecialDayInfo]
    );

    const generateTimeSlots = () => {
        if (!selectedDate || !isOperatingDay(selectedDate)) return [];

        const specialDayInfo = getSpecialDayInfo(selectedDate);
        let hours;

        if (specialDayInfo) {
            hours = { open: specialDayInfo.open, close: specialDayInfo.close };
        } else {
            const dayOfWeek = selectedDate.getDay();
            const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
            hours = operatingHoursMap[mondayBasedDay];
        }

        if (!hours) return [];

        const timeSlots = [];
        const [openHour, openMin] = hours.open.split(":").map(Number);
        const [closeHour, closeMin] = hours.close.split(":").map(Number);
        
        let currentTime = new Date(selectedDate);
        currentTime.setHours(openHour, openMin, 0, 0);
        
        const closeTime = new Date(selectedDate);
        closeTime.setHours(closeHour, closeMin, 0, 0);

        if (closeTime <= currentTime) {
            closeTime.setDate(closeTime.getDate() + 1);
        }

        const lastValidStartTime = new Date(closeTime);
        lastValidStartTime.setMinutes(lastValidStartTime.getMinutes() - restaurantTimeSlot);

        while (currentTime <= lastValidStartTime) {
            timeSlots.push(
                currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            );
            currentTime.setMinutes(currentTime.getMinutes() + restaurantTimeSlot);
        }
        
        return timeSlots;
    };

    const timeSlots = useMemo(generateTimeSlots, [
        selectedDate,
        isOperatingDay,
        operatingHoursMap,
        restaurantTimeSlot,
        getSpecialDayInfo, 
    ]);

    const handleMonthChange = (direction) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentMonth((prevMonth) => {
                const isNext = direction === "next";
                const newMonth = isNext ? prevMonth + 1 : prevMonth - 1;
                if (newMonth > 11) {
                    setCurrentYear(currentYear + 1);
                    return 0;
                }
                if (newMonth < 0) {
                    setCurrentYear(currentYear - 1);
                    return 11;
                }
                return newMonth;
            });
            setIsTransitioning(false);
        }, 150);
    };

    const handleDateClick = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        if (isOperatingDay(date)) {
            setSelectedDate(date);
            setSelectedTimeSlot(null);
        }
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8 p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const specialDayInfo = getSpecialDayInfo(date);
            const isOperating = isOperatingDay(date);
            const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

            let dayClasses = "w-8 h-8 text-sm rounded-md transition-colors ";
            let title = "";

            if (isSelected) {
                dayClasses += "bg-amber-500 text-white";
            } else if (specialDayInfo) {
                dayClasses += "bg-purple-100 text-purple-800 hover:bg-purple-200 font-bold";
                title = specialDayInfo.description; // Tooltip for special day
            } else if (isOperating) {
                dayClasses += "bg-green-100 text-green-800 hover:bg-green-200";
            } else {
                dayClasses += "bg-gray-100 text-gray-400 cursor-not-allowed";
            }

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={!isOperating && !specialDayInfo}
                    className={dayClasses}
                    title={title} 
                >
                    {day}
                </button>
            );
        }
        return days;
    };
    
    const selectedSpecialDay = selectedDate ? getSpecialDayInfo(selectedDate) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-6xl mx-auto p-6 bg-white m-4">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 mr-4 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Restaurant Calendar
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Select Date
                            </h2>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleMonthChange("prev")}
                                    className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-medium min-w-40 text-center">
                                    {months[currentMonth]} {currentYear}
                                </span>
                                <button
                                    onClick={() => handleMonthChange("next")}
                                    className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {daysOfWeek.map((day) => (
                                <div key={day} className="ml-1 text-sm font-medium text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                            <div className="grid grid-cols-7 gap-2">
                                {renderCalendarDays()}
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-purple-100 rounded"></div>
                                    <span>Special Day</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                    <span>Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
                        <div className="flex items-center space-x-2 mb-6">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Available Time Slots
                            </h2>
                        </div>

                        <div className="flex-grow">
                            {selectedDate ? (
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        {selectedDate.toLocaleDateString("en-US", {
                                            weekday: "long", year: "numeric", month: "long", day: "numeric",
                                        })}
                                    </p>
                                    
                                    {selectedSpecialDay && (
                                        <div className="p-3 mb-4 bg-purple-100 border-l-4 border-purple-500 rounded-r-md">
                                             <div className="flex">
                                                <div className="py-1"><Star className="w-5 h-5 text-purple-600 mr-3"/></div>
                                                <div>
                                                    <p className="font-bold text-purple-800">Special Event</p>
                                                    <p className="text-sm text-purple-700">{selectedSpecialDay.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {timeSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                                            {timeSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                    className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                                                        selectedTimeSlot === slot
                                                            ? "bg-amber-500 text-white border-amber-500"
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            Restaurant is closed on this day.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500 text-center">
                                        Please select a date to view available time slots
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            {selectedDate && (
                                <div className="p-4 bg-amber-50 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-amber-900 font-semibold">
                                                Your Selection
                                            </p>
                                            <p className="text-amber-800 text-sm">
                                                {selectedDate.toLocaleDateString("en-GB")}
                                                {selectedTimeSlot
                                                    ? ` at ${selectedTimeSlot}`
                                                    : " - Select a time"}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/reservation-details/${id}`}
                                            state={{
                                                selectedDate: selectedDate.toISOString(),
                                                selectedDay: selectedDate.getDay(),
                                                selectedTimeSlot,
                                                restaurantOperatingHours,
                                                restaurantSpecialDays, 
                                                restaurantTimeSlot,
                                                restaurantId: id,
                                            }}
                                            onClick={(e) => !selectedTimeSlot && e.preventDefault()}
                                            className={`px-4 py-2 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors transform hover:scale-105 ${
                                                !selectedTimeSlot
                                                    ? "opacity-50 cursor-not-allowed hover:bg-amber-600"
                                                    : ""
                                            }`}
                                        >
                                            Add Info
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default RestaurantsCalendar;