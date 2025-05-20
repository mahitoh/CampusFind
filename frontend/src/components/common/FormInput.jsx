import React from "react";

/**
 * Form Input component for consistent input styling across forms
 * @param {Object} props - Component props
 * @param {React.ElementType} props.icon - Icon component to display
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - onChange handler
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.className - Additional className
 */
const FormInput = ({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "mb-6",
}) => {
  return (
    <div className={`relative ${className} border-b-2 border-gray-400`}>
      {Icon && (
        <Icon className="absolute top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-8 py-1 text-sm bg-transparent outline-none"
        required={required}
      />
    </div>
  );
};

export default FormInput;
