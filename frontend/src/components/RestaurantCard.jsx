// components/RestaurantCard.tsx
import React from 'react';

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="border rounded-lg shadow p-4">
      <h2 className="text-xl font-bold">{restaurant.name}</h2>
      <p>{restaurant.description}</p>
      <button className="mt-2 bg-amber-500 text-white py-1 px-4 rounded">
        View Details
    </button>
    </div>
  );
}
