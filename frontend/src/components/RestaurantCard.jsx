import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-200">
            {restaurant.name}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {restaurant.description}
          </p>
        </div>
        <div className="flex justify-end">
          <Link
            to={`/restaurants/${restaurant.id}`}
            state={{ restaurant }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2.5 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
      
    </div>
  );
}