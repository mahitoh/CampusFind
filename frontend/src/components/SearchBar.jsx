import React, { useState } from "react";
// Import icons (assuming you'll install lucide-react)
// If you don't have lucide-react, you can install it with: npm install lucide-react

const SearchBar = ({
  className = "",
  placeholder = "Search for lost items...",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  // A simple utility function to merge classNames
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center w-full max-w-lg mx-auto relative group",
        className
      )}
    >
      <div className="relative flex items-center w-full bg-white/80 backdrop-blur-sm rounded-full overflow-hidden px-4 py-2">
        {/* Search icon - replace with your icon component or SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "w-5 h-5 mr-2 transition-colors",
            isFocused ? "text-[#a402cc]" : "text-gray-400"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none placeholder:text-gray-400"
          placeholder={placeholder}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {/* X icon - replace with your icon component or SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#a402cc] transition-all duration-300",
          isFocused ? "w-[calc(100%-16px)]" : "w-0"
        )}
      />
    </form>
  );
};

export default SearchBar;
