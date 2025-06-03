import React, { useEffect } from "react";
import { useItems } from "../../context/ItemsContext";

/**
 * Debug component to help troubleshoot item loading issues
 */
const ItemsDebugger = () => {
  const { items, loading, error } = useItems();

  // Only log debug info when there are errors
  useEffect(() => {
    if (error) {
      console.log("Items Context Error:", {
        error,
        itemCount: items?.length || 0,
        loading,
        timestamp: new Date().toISOString(),
      });
    }
  }, [items, loading, error]);

  return null; // Don't show anything on screen
};

export default ItemsDebugger;
