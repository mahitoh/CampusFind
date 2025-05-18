import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import bg1 from "./assets/images/bg.jpg";
import bg2 from "./assets/images/download.jpg";
import bg3 from "./assets/images/download1.jpg";
import bg4 from "./assets/images/images.jpg";
import FeaturedItems from "./components/FeaturedItems";
import Testimonials from "./components/Testimonials";
import SignUp from "./pages/SignUp";
import Slider from "./components/Slider";

function App() {
  const images = [bg1, bg2, bg3, bg4];

  const HomePage = () => (
    <div className="min-h-screen">
      {" "}
      <NavBar />
      {/* Background Slideshow - only for hero section */}
      <Slider images={images} />
      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto">
          <HeroSection />
        </div>
        <div className="bg-white relative z-10">
          <FeaturedItems />
          <Testimonials />
          <Footer />
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignUp isLoginMode={true} />} />
      </Routes>
    </>
  );
}

export default App;
