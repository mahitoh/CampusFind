import React, { useState } from "react";

const LostItemCard = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all h-full">
      {/* Card image */}
      <div className="w-full h-full relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-100 animate-pulse ${
            isLoaded ? "hidden" : "block"
          }`}
        />
        <img
          src={item.image}
          alt={item.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Status badge */}
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-black/40 backdrop-blur-sm rounded-sm text-white">
          {item.status}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-medium text-base line-clamp-1 text-balance leading-tight">
            {item.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{item.date}</span>
            <span className="text-xs text-gray-500">{item.location}</span>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600 line-clamp-3">
          {item.description}
        </div>
      </div>
    </div>
  );
};

export default LostItemCard;
