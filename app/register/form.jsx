"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import PrimaryButton from "../components/UI/PrimaryButton";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    phoneLocal: "",
    email: "",
    password: "",
    confirmPassword: "",
    governorate: "",
    addressDetails: "",
  });
  const [phoneError, setPhoneError] = useState(""); // State for phone validation error
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState("/user.png");
  const fileInputRef = useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!/^1[0125]\d{8}$/.test(form.phoneLocal)) {
      alert("Phone number must start with 10, 11, 12, or 15 and be 10 digits.");
      return;
    }
    console.log("Register form submitted:", form);
  }

  function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
    e.target.value = null;
  }

  function resetProfilePic() {
    setProfilePic("/user.png");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  function validatePhoneNumber(value) {
    const pattern = /^1[0125]\d{8}$/;
    if (!pattern.test(value)) {
      setPhoneError(
        "Phone number must start with 10, 11, 12, or 15 and be 10 digits."
      );
    } else {
      setPhoneError("");
    }
  }

  const governorates = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Qalyubia",
    "Sharqia",
    "Dakahlia",
    "Beheira",
    "Kafr El Sheikh",
    "Gharbia",
    "Monufia",
    "Ismailia",
    "Port Said",
    "Suez",
    "Damietta",
    "Faiyum",
    "Beni Suef",
    "Minya",
    "Asyut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai",
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-primary-gray-50 rounded-xl px-4 py-6 w-full max-w-3xl mx-auto md:items-start"
    >
      {/* Left section – Form fields */}
      <div className="flex flex-col space-y-4 text-black text-sm">
        {/* Username */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="font-medium text-black">
            Username <span className="text-secondary-400">*</span>
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border border-primary-gray-300 rounded-md px-3 py-2 bg-primary-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            required
          />
        </div>

        {/* Phone number */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="phoneNumber" className="font-medium text-black">
            Mobile number <span className="text-secondary-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 rounded-md border border-primary-gray-300 bg-primary-gray-100 px-2 py-2 text-black w-32 justify-center text-sm"
              aria-label="Country"
            >
              <span aria-hidden>🇪🇬</span>
              <span>+20</span>
            </div>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="1XXXXXXXXX"
              className={`flex-1 rounded-md border border-primary-gray-300 bg-primary-white px-3 py-2 text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition ${
                phoneError ? "border-secondary-400" : ""
              }`}
              value={form.phoneLocal}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, phoneLocal: value });
                validatePhoneNumber(value);
              }}
              required
            />
          </div>
          {phoneError && (
            <p className="text-secondary-400 text-xs">{phoneError}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-black">
            Email <span className="text-secondary-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-primary-gray-300 rounded-md px-3 py-2 bg-primary-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-1 relative">
          <label htmlFor="password" className="font-medium text-black">
            Password <span className="text-secondary-400">*</span>
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-primary-gray-300 rounded-md px-3 py-2 pr-9 bg-primary-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8"
          >
            <Image
              src={showPassword ? "/NotVision.svg" : "/Vision.svg"}
              alt="Toggle password visibility"
              width={18}
              height={18}
            />
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col space-y-1 relative">
          <label htmlFor="confirmPassword" className="font-medium text-black">
            Confirm Password <span className="text-secondary-400">*</span>
          </label>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="border border-primary-gray-300 rounded-md px-3 py-2 pr-9 bg-primary-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-8"
          >
            <Image
              src={showConfirm ? "/NotVision.svg" : "/Vision.svg"}
              alt="Toggle confirm password visibility"
              width={18}
              height={18}
            />
          </button>
        </div>
      </div>

      {/* Right section – Profile picture + Address */}
      <div className="flex flex-col justify-start text-black text-sm space-y-4">
        {/* Profile picture */}
        <div className="flex flex-col items-center space-y-3 mt-1 md:mt-0">
          <h2 className="font-medium text-black">Profile picture</h2>

          <div className="relative w-24 h-24 rounded-full border border-primary-gray-300 bg-primary-gray-100">
            <div className="relative w-full h-full overflow-hidden rounded-full">
              <Image
                src={profilePic}
                alt="Profile placeholder"
                fill
                className="object-cover"
              />
            </div>
            {profilePic !== "/user.png" && (
              <button
                type="button"
                onClick={resetProfilePic}
                className="absolute -top-1 -right-1 bg-primary-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-accent-600 transition"
              >
                ✕
              </button>
            )}
          </div>

          <label
            htmlFor="profileImage"
            className="cursor-pointer bg-primary-gray-200 hover:bg-accent-400 text-black px-3 py-2 rounded-md text-sm font-medium transition"
          >
            Add Picture
          </label>
          <input
            id="profileImage"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicUpload}
          />
        </div>

        {/* Address Section */}
        <div className="flex flex-col space-y-1 w-full mt-3">
          <label htmlFor="governorate" className="font-medium text-black">
            Address <span className="text-secondary-400">*</span>
          </label>

          <div className="flex flex-col space-y-3 w-full">
            <select
              id="governorate"
              value={form.governorate}
              onChange={(e) =>
                setForm({ ...form, governorate: e.target.value })
              }
              className="border border-primary-gray-300 rounded-md px-3 py-2 bg-primary-white text-black focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              required
            >
              <option value="">Select governorate</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>

            <textarea
              id="addressDetails"
              placeholder="Street name, building number, apartment, landmark..."
              value={form.addressDetails}
              onChange={(e) =>
                setForm({ ...form, addressDetails: e.target.value })
              }
              className="border border-primary-gray-300 rounded-md px-3 py-2 bg-primary-white text-black placeholder-gray-400 h-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              required
            ></textarea>
          </div>
        </div>
      </div>

      {/* Button row spanning both columns */}
      <div className="w-full md:col-span-2 mt-4">
        <PrimaryButton className="w-full bg-primary-400 hover:bg-primary-600 text-white rounded-md py-2 transition">
          Create Account
        </PrimaryButton>
      </div>
    </form>
  );
}
