"use client";
import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

export default function ProfileHeader() {
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("pressed");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const u = await supabase.auth.getUser();

      const id = u.data.user.id;
      const res = await fetch(`/api/user/${id}`, {
        method: "GET",
        credentials: "include", // Key fix: Sends cookies/sessions for auth
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch user profile");
        return;
      }
      const data = await res.json();
      console.log("User Profile:", data);
      //map el data le user model
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    /*This is the page laybout */
    <div className="min-h-screen w-full bg-gray-100 flex justify-center py-10">
      <div className="bg-white shadow-xl rounded-xl w-3/4 p-10">
        {/* Top Header */}

        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-semibold text-black">Profile</h1>
        </div>

        {/* profile info */}

        <div className="flex items-center gap-8 mb-8">
          <img
            src="andreapfp.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm"
          />

          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800">
              Andrea Aziz
            </h2>
            <p className="text-gray-500 text-sm flex items-center">
              Andrea@gmail.com
            </p>

            <button className="mt-3 border border-blue-500 text-blue-500 rounded-full px-5 py-1.5 hover:bg-blue-50 transition w-fit">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex border-b mb-6 text-lg font-medium">
          <button
            onClick={() => setActiveTab("pressed")}
            className={`px-6 py-2 transition ${
              activeTab === "pressed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-2transition ${
              activeTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
