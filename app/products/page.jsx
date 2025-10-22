"use client";

import { useState } from "react"; // Optional: Add state for loading/error display
import PrimaryButton from "../components/UI/PrimaryButton";
//import { supabase } from "@/lib/supabase";

function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProductHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "GET",
        credentials: "include", // Key fix: Sends cookies/sessions for auth
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Parse error if possible
        console.error("API Error:", errorData);
        setError(
          `Error: ${res.status} - ${errorData.message || "Unauthorized access"}`
        );
        return;
      }

      const data = await res.json();
      console.log("Products:", data);
      // TODO: Render products in your marketplace UI here
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Network error – check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {" "}
      {/* Add some marketplace styling */}
      <PrimaryButton onClick={getProductHandler} disabled={loading}>
        {loading ? "Loading Products..." : "Get Products"}
      </PrimaryButton>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default ProductsPage;
