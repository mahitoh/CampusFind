import React, { useState, useEffect } from "react";

const Slider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-screen">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`background ${index + 1}`}
          crossOrigin="anonymous"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-15" : "opacity-0"
          }`}
        />
      ))}
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default Slider;
