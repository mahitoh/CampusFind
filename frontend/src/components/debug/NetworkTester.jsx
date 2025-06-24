import React, { useState } from "react";
import axios from "axios";

const NetworkTester = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic API endpoint
      const response = await axios.get("http://localhost:8000/api");
      setTestResult({
        success: true,
        message: "API connection successful",
        data: response.data,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "API connection failed",
        error: error.message,
        details: error.response?.data || error.code,
      });
    }
    setLoading(false);
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });
      setTestResult({
        success: true,
        message: "Registration test successful",
        data: response.data,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "Registration test failed",
        error: error.message,
        details: error.response?.data || error.code,
      });
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      width: "300px",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      zIndex: 9999,
      fontSize: "12px"
    }}>
      <h4 style={{ margin: "0 0 10px 0" }}>Network Tester</h4>
      
      <div style={{ marginBottom: "10px" }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{ marginRight: "5px", padding: "5px 10px" }}
        >
          Test API
        </button>
        <button 
          onClick={testRegistration}
          disabled={loading}
          style={{ padding: "5px 10px" }}
        >
          Test Registration
        </button>
      </div>

      {loading && <div>Testing...</div>}
      
      {testResult && (
        <div style={{
          backgroundColor: testResult.success ? "#d4edda" : "#f8d7da",
          border: `1px solid ${testResult.success ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px",
          padding: "10px",
          marginTop: "10px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            {testResult.message}
          </div>
          {testResult.data && (
            <div style={{ fontSize: "11px", color: "#666" }}>
              {JSON.stringify(testResult.data, null, 2)}
            </div>
          )}
          {testResult.error && (
            <div style={{ fontSize: "11px", color: "#721c24" }}>
              Error: {testResult.error}
            </div>
          )}
          {testResult.details && (
            <div style={{ fontSize: "11px", color: "#721c24" }}>
              Details: {JSON.stringify(testResult.details)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkTester; 