"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber:"",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirm2, setShowConfirm2] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    console.log("Register");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4 w-full">
      {/* First Name & Surname */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Phone number */}
      <div className="flex flex-col space-y-1">
        
       <label htmlFor="phone" className="text-sm font-medium text-gray-700">
       Mobile number
      </label>
      <div className="flex items-center gap-3">
        <div    
       className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 w-32 justify-center"
       aria-label="Country"
       >
          <span aria-hidden>🇪🇬</span>
          <span>+20</span>
</div>
        <input
         id="phoneLocal"
      type="tel"
      inputMode="numeric"
      placeholder="1XXXXXXXXX"
      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400"
      value={form.phoneLocal ?? ""}
      onChange={(e) =>
        setForm({
          ...form,
          phoneLocal: e.target.value.replace(/\D/g, "").slice(0, 10),
        })
      }
      pattern="^1[0125]/d{8}$"
            title="Starts with 10/11/12/15 and is 10 digits"

      ></input>
      </div>

      </div>  

      {/* Email */}
      <div className="flex flex-col space-y-1 text-black">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col space-y-1 text-black relative">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
         <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9"
          aria-pressed={showPassword}
          aria-label="Toggle password visibility"
        >
          <Image
            src={showPassword ? "/NotVision.svg" : "/Vision.svg"}
            alt="Toggle password visibility"
            width={22}
            height={22}
          />
        </button>
      </div>



    <div className="flex flex-col space-y-1 text-black relative">
  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
    Confirm Password
  </label>
  <input
    id="confirmPassword"
    type={showConfirm ? "text" : "password"}
    placeholder="Please confirm your password"
    value={form.confirmPassword}
    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
    className="border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
  />
  <button
    type="button"
    onClick={() => setShowConfirm((v) => !v)}
    className="absolute right-3 top-9 z-10"
    aria-pressed={showConfirm}
    aria-label="Toggle confirm password visibility"
  >
    <Image
      src={showConfirm ? "/NotVision.svg" : "/Vision.svg"}
      alt="Toggle confirm password visibility"
      width={22}
      height={22}
    />
  </button>


</div>
      <button
        type="submit"
        className="bg-gray-900 text-white font-medium py-2 rounded-md hover:bg-gray-800 transition"
      >
        Create Account
      </button>
    </form>
  );
}
