import { useState, useEffect } from "react";

/**
 * Custom hook that tracks the scroll position of the window
 * @returns {Object} - Object containing the scrollY position
 */
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Call handler right away to update initial state
    handleScroll();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty array ensures effect runs only on mount and unmount

  return { scrollY };
}

export default useScrollPosition;
