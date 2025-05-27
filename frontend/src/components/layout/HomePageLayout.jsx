import React from "react";
import NavBar from "../NavBar";
import HeroSection from "../HeroSection";
import Footer from "../Footer";
import FeaturedItems from "../FeaturedItems";
import Testimonials from "../Testimonials";
import Slider from "../Slider";

/**
 * HomePage component with full layout
 * @param {Object} props - Component props
 * @param {Array} props.images - Slider images
 */
const HomePageLayout = ({ images }) => (
  <div className="min-h-screen">
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

export default HomePageLayout;
