import React from "react";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

/**
 * Social Media Button component for authentication pages
 */
const SocialMediaButtons = () => {
  return (
    <>
      <p className="text-gray-500 text-xs my-6 text-center cursor-pointer">
        Or Sign up using
      </p>
      <div className="flex justify-center space-x-4 text-white text-lg cursor-pointer">
        <a href="#" className="cursor-pointer">
          <FaFacebookF className="w-10 h-10 bg-blue-800 p-2 rounded-full border-2 border-white hover:bg-white hover:text-blue-800" />
        </a>
        <a href="#" className="cursor-pointer">
          <FaGoogle className="w-10 h-10 bg-red-600 p-2 rounded-full border-2 border-white hover:bg-white hover:text-red-600" />
        </a>
        <a href="#" className="cursor-pointer">
          <FaTwitter className="w-10 h-10 bg-[#098dc1] p-2 rounded-full border-2 border-white hover:bg-white hover:text-[#098dc1]" />
        </a>
      </div>
    </>
  );
};

export default SocialMediaButtons;
