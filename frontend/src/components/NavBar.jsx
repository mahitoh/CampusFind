import logoUrl from "../assets/icons/logo1.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextNew";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

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
      className={`fixed inset-x-0 top-0 w-full z-30 transition-all duration-500 ${
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
          </nav>{" "}
          <div>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-medium bg-[#098dc1] px-4 py-2 rounded-lg mr-2 text-white cursor-pointer hover:bg-accent/90 active:opacity-70 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="font-medium bg-red-500 px-4 py-2 rounded-lg ml-2 text-white cursor-pointer hover:bg-red-600 active:opacity-70 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="font-medium bg-[#a402cc] px-4 py-2 rounded-lg mr-2 text-white cursor-pointer hover:bg-accent/90 active:opacity-70 transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="font-medium bg-[#a402cc] px-4 py-2 rounded-lg ml-2 text-white cursor-pointer hover:bg-accent/90 active:opacity-70 transition-all"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
