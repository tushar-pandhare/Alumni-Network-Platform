import React, { useEffect } from "react";
import axios from "axios";

const TestBackendComponent = () => {
  const testBackend = async () => {
    try {
      const res = await axios.post("/alumni-story", {
        name: "Test User Tushar Pandhare ",
        email: "testtushar-pandhare@example.com",
        title: "Test Title Tushar pandhare",
        story: "Test Story of tushar pandhare"
      });
      console.log("✅ Response from backend:", res.data);
    } catch (error) {
      console.error("❌ Error posting data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Testing Backend...</h2>
      <p>Open the console to see the result.</p>
    </div>
  );
};

export default TestBackendComponent;
