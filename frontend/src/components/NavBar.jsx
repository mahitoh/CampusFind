import logoUrl from "../assets/icons/logo1.png";

const NavBar = () => {
  return (
    <div className="sticky inset-x-0 top-0 w-full  z-30">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20 relative">
        <div className="flex items-center justify-between">
          <div>
            <img src={logoUrl} alt="Logo" className="h-20 w-20" />
          </div>
          <nav>
            <ul className="flex flex-row space-x-4 p-4">
              <li>
                <a href="/" className="text-gray-800">
                  Home
                </a>
              </li>
              <li>
                <a href="" className="text-gray-800">
                  About Us
                </a>
              </li>
              <li>
                <a href="" className="text-gray-800">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <a className="font-mono  bg-blue-500 px-4 py-2 rounded-md mr-2 text-white cursor-pointer">
              Login
            </a>
            <a className="font-mono bg-blue-500 px-4 py-2 rounded-md ml-2  text-white cursor-pointer">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
