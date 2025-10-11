"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { handleSignUp } from "./loginActions"; //from "@/app/actions";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [userType, setUserType] = useState("buyer"); // Default to buyer
  const [state, formAction, isPending] = useActionState(handleSignUp, {
    error: null,
    redirect: null,
  });

  // Handle redirects from server action
  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect, router]);

  // Handle userType change to toggle fields
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          User Type
        </label>
        <select
          name="userType"
          value={userType}
          onChange={handleUserTypeChange}
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>
      {userType === "buyer" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {userType === "seller" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Area
            </label>
            <input
              type="text"
              name="serviceArea"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
        </>
      )}
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {isPending && <p className="text-blue-500 text-sm">Submitting...</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Sign Up
      </button>
    </form>
  );
}
