import React from "react";

/**
 * Submit Button component for consistent button styling across forms
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.className - Additional className
 */
const SubmitButton = ({ text, className = "" }) => {
  return (
    <button
      type="submit"
      className={`w-full mt-6 py-2 rounded-full bg-gradient-to-r from-[#098dc1] to-[#f417de] text-white font-medium relative overflow-hidden cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
