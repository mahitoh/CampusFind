import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-4 items-center md:px-16 lg:px-28 py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 justify-center">
        <div className="lg:mr-10 mr-0">
          <h2 className="text-lg font-bold mb-4 text-white ">
            About CampusFind
          </h2>
          <p className="text-gray-400 font-medium ">
            CampusFind helps students navigate and discover campus facilities,
            making university life easier and more accessible.
          </p>
          <p className="text-gray-400 mt-2 font-medium">
            Our mission is to connect students with their campus resources
            efficiently.
          </p>
        </div>
        <div className="">
          <h2 className="text-lg font-bold mb-4 text-white">Quick Links</h2>
          <ul className="text-gray-400  w-20">
            <li className="hover:underline mb-2 font-medium hover:text-[#a402cc]">
              <a href="/">Home</a>
            </li>
            <li className="hover:underline mb-2 font-medium hover:text-[#a402cc]">
              <a href="/map">Campus Map</a>
            </li>
            <li className="hover:underline mb-2 font-medium hover:text-[#a402cc]">
              <a href="/facilities">Facilities</a>
            </li>
            <li className="hover:underline mb-2 font-medium hover:text-[#a402cc]">
              <a href="/about">About Us</a>
            </li>
          </ul>
        </div>

        <div className="">
          <h2 className="text-lg font-bold mb-4 text-white">Contact Us</h2>
          <div className="text-gray-400 mb-6 font-medium">
            <p>Email: contact@campusfind.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 University Ave, Campus City, ST 12345</p>
          </div>

          <h2 className="text-lg font-bold mb-4 text-white">Follow Us</h2>
          <ul className="flex space-x-4 ">
            <li>
              <FaFacebook className="text-[#a402cc] hover:text-white cursor-pointer" />
              <a href="#" className="text-[#a402cc] hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <FaTwitter className="text-[#a402cc] hover:text-white cursor-pointer" />
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <FaInstagram className="text-[#a402cc] hover:text-white cursor-pointer" />
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <FaLinkedin className="text-[#a402cc] hover:text-white cursor-pointer" />
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
            <li>
              <FaGithub className="text-[#a402cc] hover:text-white cursor-pointer" />
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-8 py-4">
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} CampusFind. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
