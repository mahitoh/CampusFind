import React from "react";

/**
 * Form Options component containing "Remember Me" checkbox and "Forgot Password" link
 */
const FormOptions = () => {
  return (
    <div className="flex justify-between text-xs mt-2">
      <label className="flex items-center gap-1">
        <input type="checkbox" />
        Remember Me
      </label>
      <a href="#" className="text-gray-600">
        Forgot Password?
      </a>
    </div>
  );
};

export default FormOptions;
