import logoUrl from "../assets/icons/logo1.png";
import { useState, useEffect } from "react";
// import {useScroll} from ""

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll position:", window.scrollY);
      if (window.scrollY > 0) {
        console.log("Setting scrolled to true");
        setIsScrolled(true);
      } else {
        console.log("Setting scrolled to false");
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Call handleScroll once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("Current isScrolled state:", isScrolled);

  return (
    <div
      className={`fixed inset-x-0 top-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20 relative">
        <div className="flex items-center justify-between">
          <div>
            <img src={logoUrl} alt="Logo" className="h-20 w-20" />
          </div>
          <nav>
            <ul className="flex flex-row space-x-4 p-4">
              <li>
                <a
                  href="/"
                  className={`${
                    isScrolled ? "text-gray-800" : "text-white"
                  } font-medium hover:text-accent transition-colors`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href=""
                  className={`${
                    isScrolled ? "text-gray-800" : "text-white"
                  } font-medium hover:text-accent transition-colors`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href=""
                  className={`${
                    isScrolled ? "text-gray-800" : "text-white"
                  } font-medium hover:text-accent transition-colors`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <div>
            {/* <a className="font-mono bg-[#a402cc] px-4 py-2 rounded-md mr-2 text-white cursor-pointer">
              Login
            </a> */}
            <a className="font-medium  bg-[#a402cc] px-4 py-2 rounded-lg bg-accent ml-2 text-white cursor-pointer hover:bg-accent/90 transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
