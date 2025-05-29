import React, { useEffect } from "react";
import { useItems } from "../../context/ItemsContext";

/**
 * Debug component to help troubleshoot item loading issues
 */
const ItemsDebugger = () => {
  const { items, loading, error } = useItems();

  useEffect(() => {
    console.log("Items Context Debug:", {
      itemCount: items?.length || 0,
      loading,
      error,
      itemTypes: items?.map((item) => item.status)?.filter(Boolean),
      itemsPreview: items?.slice(0, 2) || [],
      hasValidItems: Array.isArray(items) && items.length > 0,
      timestamp: new Date().toISOString(),
    });
  }, [items, loading, error]);

  // Only render in development mode, and only if there are errors
  if (import.meta.env.MODE === "development" && error) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          padding: "8px",
          background: "#ffeded",
          border: "1px solid #ff6b6b",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 9999,
          maxWidth: "300px",
          display: "block",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ color: "red", fontWeight: "bold" }}>Error: {error}</div>
        <div>Items: {items?.length || 0}</div>
        <div>Status: {loading ? "Loading..." : "Error"}</div>
      </div>
    );
  }

  return null; // Don't render anything in production or when there are no errors
};

export default ItemsDebugger;
