import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import bg1 from "./assets/images/bg.jpg";
import bg2 from "./assets/images/download.jpg";
import bg3 from "./assets/images/download (1).jpg";
import bg4 from "./assets/images/images.jpg";

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [bg1, bg2, bg3, bg4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-15" : "opacity-0"
            }`}
          />
        ))}
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <NavBar />
        <div className="container mx-auto">
          <HeroSection />
        </div>
      </div>
    </div>
  );
}

export default App;
