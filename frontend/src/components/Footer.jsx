import React from "react";
import logoUrl from "../assets/icons/logo1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Footer - Two Column Layout */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 max-w-screen-2xl">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Left Column - Company Info */}
          <div className="lg:w-5/12 mb-10 lg:mb-0 flex flex-col md:flex-row lg:flex-col gap-8 md:gap-12 lg:gap-8">
            {/* About Section */}
            <div className="md:w-1/2 lg:w-full">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoUrl} alt="CampusFind Logo" className="h-10 w-10" />
                <h3 className="text-xl font-bold">Campus<span className="text-[#a402cc]">Find</span></h3>
              </div>
              <p className="text-gray-400 text-sm max-w-lg">
                CampusFind helps students reconnect with their lost belongings by creating a centralized 
                platform for reporting and finding lost items on campus.
              </p>
              <div className="flex space-x-4 mt-6">
                {/* Social Media Icons */}
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-[#a402cc] transition-colors"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-[#a402cc] transition-colors"
                  aria-label="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-[#a402cc] transition-colors"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-[#a402cc] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Section */}
            <div className="md:w-1/2 lg:w-full">
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mt-0.5 text-[#a402cc]">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div>123 University Ave,<br />Campus City, State 12345</div>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#a402cc]">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a href="tel:+1234567890" className="hover:text-white footer-link-hover">+1 (234) 567-890</a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#a402cc]">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href="mailto:info@campusfind.edu" className="hover:text-white footer-link-hover">info@campusfind.edu</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Links and Newsletter */}
          <div className="lg:w-6/12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Home</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">About Us</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Report Lost Item</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Browse Found Items</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Contact</a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">FAQ</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Campus Map</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Security Tips</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors footer-link-hover">Terms of Service</a>
                  </li>
                </ul>
              </div>

              {/* Newsletter Subscription */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Newsletter</h4>
                <p className="text-gray-400 text-sm mb-4">Stay updated with our latest news and features</p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-800 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#a402cc] w-full"
                  />
                  <button
                    type="submit"
                    className="bg-[#a402cc] px-4 py-2 rounded-md hover:bg-[#8a02ac] transition-colors w-full text-sm font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center max-w-screen-2xl">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} CampusFind. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors footer-link-hover">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors footer-link-hover">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors footer-link-hover">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
