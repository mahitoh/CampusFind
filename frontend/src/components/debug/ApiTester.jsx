import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, formatImageUrl } from "../../services/apiClient";

/**
 * Component to test direct API access
 * This helps debug if there are any issues with the API connection directly
 */
const ApiTester = () => {
  const [apiResult, setApiResult] = useState({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    const testApi = async () => {
      try {
        // Try to fetch items directly from the API
        const response = await axios.get(`${API_BASE_URL}/items`);

        // Format response data if successful
        const formattedItems = response.data.data.map((item) => ({
          ...item,
          image:
            item.images && item.images.length > 0
              ? formatImageUrl(item.images[0])
              : null,
        }));

        setApiResult({
          loading: false,
          data: formattedItems,
          error: null,
        });

        console.log("Direct API test successful:", {
          itemCount: formattedItems.length,
          firstItem: formattedItems[0] || null,
          apiUrl: `${API_BASE_URL}/items`,
        });
      } catch (error) {
        console.error("Direct API test failed:", error);
        setApiResult({
          loading: false,
          data: null,
          error: error.message || "Failed to connect to API",
        });
      }
    };

    testApi();
  }, []);

  // Only render in development
  if (import.meta.env.MODE === "production") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "60px",
        right: "10px",
        padding: "10px",
        backgroundColor: apiResult.error ? "#ffeded" : "#f0f8ff",
        border: `1px solid ${apiResult.error ? "#ff6b6b" : "#ccc"}`,
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
        maxHeight: "200px",
        overflow: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 5px 0" }}>API Test</h4>
      {apiResult.loading && <div>Testing API connection...</div>}
      {!apiResult.loading && (
        <>
          <div>Status: {apiResult.error ? "Error" : "Success"}</div>
          <div>Items: {apiResult.data ? apiResult.data.length : 0}</div>
          {apiResult.error && (
            <div style={{ color: "red" }}>Error: {apiResult.error}</div>
          )}
          {apiResult.data && apiResult.data.length > 0 && (
            <div>
              <div>Sample item:</div>
              <div
                style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}
              >
                {apiResult.data[0].title || apiResult.data[0].name}
              </div>
              <div style={{ fontSize: "10px", color: "#666" }}>
                Status: {apiResult.data[0].status}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApiTester;
