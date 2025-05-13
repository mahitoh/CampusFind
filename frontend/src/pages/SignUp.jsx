import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaFacebookF,
  FaGoogle,
  FaTwitter,
} from "react-icons/fa";

const SignUp = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#098dc1] via-[#098dc1] to-[#f417de]">
      <div className="relative w-[410px] h-[650px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
        {/* Login Form */}
        <div
          className={`absolute w-full px-8 transition-transform duration-500 ${
            isRegister ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
          <form>
            <div className="relative mb-10 border-b-2 border-gray-400">
              <FaUser className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
              <input
                type="text"
                placeholder="Enter Your Username*"
                className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
              />
            </div>
            <div className="relative mb-4 border-b-2 border-gray-400">
              <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
              <input
                type="password"
                placeholder="Enter Your Password*"
                className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <label className="flex items-center gap-1">
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#" className="text-gray-600">
                Forgot Password?
              </a>
            </div>
            <button className="w-full mt-6 py-2 rounded-full bg-gradient-to-r from-[#098dc1] to-[#f417de] text-white font-medium relative overflow-hidden cursor-pointer">
              Login
            </button>
          </form>
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
          <p className="text-sm mt-4 text-center cursor-pointer">
            <button
              className="text-blue-700 hover:underline"
              onClick={() => setIsRegister(true)}
            >
              Register Now
            </button>
          </p>
        </div>

        {/* Register Form */}
        <div
          className={`absolute w-full px-8 transition-transform duration-500 ${
            isRegister ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 ">Register</h2>
          <form>
            <div className="relative mb-8 border-b-2 border-gray-400">
              <FaUser className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
              <input
                type="text"
                placeholder="Enter Your Username*"
                className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
              />
            </div>
            <div className="relative mb-4 border-b-2 border-gray-400">
              <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
              <input
                type="password"
                placeholder="Enter Your Password*"
                className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
              />
            </div>
            <div className="relative mb-4 border-b-2 border-gray-400">
              <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
              <input
                type="password"
                placeholder="Confirm Your Password*"
                className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <label className="flex items-center gap-1">
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#" className="text-gray-600">
                Forgot Password?
              </a>
            </div>
            <button className="w-full mt-6 py-2 rounded-full bg-gradient-to-r from-[#098dc1] to-[#f417de] text-white font-medium relative overflow-hidden cursor-pointer">
              Register
            </button>
          </form>
          <p className="text-gray-500 text-xs my-6 text-center cursor-pointer">
            Or Sign up using
          </p>

          <div className="flex justify-center space-x-4 text-white text-lg">
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
          <p className="text-sm mt-4 text-center">
            <button
              className="text-blue-700 hover:underline cursor-pointer"
              onClick={() => setIsRegister(false)}
            >
              Login Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
