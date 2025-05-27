import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContextNew";
import { useNavigate } from "react-router-dom";
import SocialMediaButtons from "../components/common/SocialMediaButtons";
import FormOptions from "../components/common/FormOptions";
import FormInput from "../components/common/FormInput";
import SubmitButton from "../components/common/SubmitButton";

const SignUp = ({ isLoginMode = false }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(!isLoginMode);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle register form input changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { signIn, signUp } = useAuth();

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted:", loginForm);

    try {
      // Call the signIn function from AuthContext with proper format
      // Using username as email since our login form has username field
      const result = await signIn({
        email: loginForm.username, // Using username field for email/username
        password: loginForm.password,
      });
      if (result.success) {
        // Redirect to dashboard on successful login
        console.log("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Login failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + (error.message || "Unknown error"));
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log("Register form submitted:", {
      ...registerForm,
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]",
    });

    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate required fields
    if (
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password
    ) {
      alert("Username, email and password are required!");
      return;
    }

    try {
      // Call the signUp function from AuthContext
      const result = await signUp({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      });

      console.log("Registration response:", result);
      if (result && result.success) {
        alert("Registration successful! Please log in.");
        setIsRegister(false); // Switch to login form

        // Pre-fill login form with registered email/username for convenience
        setLoginForm({
          username: registerForm.email, // Using email as username
          password: "",
        });

        // Navigate to login or clear the form
        if (isLoginMode) {
          // If we're on a combined login/signup page, just switch to login mode
          setIsRegister(false);
        } else {
          navigate("/login"); // Navigate to login page
        }
      } else {
        const errorMessage =
          result && result.error ? result.error : "Unknown error occurred";
        alert("Registration failed: " + errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + (error.message || "Unknown error"));
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#098dc1] via-[#098dc1] to-[#f417de]">
      {" "}
      {/* Back button - positioned absolutely at the top-left corner */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 hover:text-blue-700 p-3 rounded-full transition-all duration-300 shadow-md flex items-center gap-1 hover:gap-2"
        aria-label="Back to Home"
        title="Back to Home"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-sm font-medium hidden sm:inline">Home</span>
      </button>
      <div className="relative w-[410px] h-[650px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
        {/* Login Form */}
        <div
          className={`absolute w-full px-8 transition-transform duration-500 ${
            isRegister ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {" "}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>{" "}
          <form onSubmit={handleLoginSubmit}>
            <FormInput
              icon={FaUser}
              type="text"
              name="username"
              value={loginForm.username}
              onChange={handleLoginChange}
              placeholder="Enter Your Username*"
              required={true}
              className="mb-10 border-b-2 border-gray-400"
            />
            <FormInput
              icon={FaLock}
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="Enter Your Password*"
              required={true}
              className="mb-4 border-b-2 border-gray-400"
            />
            <FormOptions />
            <SubmitButton text="Login" />
          </form>
          <SocialMediaButtons />{" "}
          <p className="text-sm mt-4 text-center cursor-pointer">
            <a
              href="#"
              className="text-blue-700 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setIsRegister(true); // Toggle to register form
              }}
            >
              Register Now
            </a>
          </p>
        </div>

        {/* Register Form */}
        <div
          className={`absolute w-full px-8 transition-transform duration-500 ${
            isRegister ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {" "}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Register
          </h2>{" "}
          <form onSubmit={handleRegisterSubmit}>
            <FormInput
              icon={FaUser}
              type="text"
              name="username"
              value={registerForm.username}
              onChange={handleRegisterChange}
              placeholder="Enter Your Username*"
              required={true}
              className="mb-6 border-b-2 border-gray-400"
            />
            <FormInput
              icon={FaEnvelope}
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder="Enter Your Email*"
              required={true}
              className="mb-6 border-b-2 border-gray-400"
            />
            <FormInput
              icon={FaLock}
              type="password"
              name="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              placeholder="Enter Your Password*"
              required={true}
              className="mb-4 border-b-2 border-gray-400"
            />
            <FormInput
              icon={FaLock}
              type="password"
              name="confirmPassword"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              placeholder="Confirm Your Password*"
              required={true}
              className="mb-4 border-b-2 border-gray-400"
            />
            <FormOptions />
            <SubmitButton text="Register" />
          </form>
          <SocialMediaButtons />{" "}
          <p className="text-sm mt-4 text-center">
            <a
              href="#"
              className="text-blue-700 hover:underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsRegister(false); // Toggle to login form
              }}
            >
              Login Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
