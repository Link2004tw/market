"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [form,setForm] = useState({
    firstName:"",
    lastName:"",
    email: "",
    password:"",
    confirmPassword:""
  
  });
  function onSubmit(e) {
    e.preventDefault();
    console.log("Register");
  }

  return (
    <form 
    onSubmit={onSubmit}
    className="flex flex-col space-y-4 w-full"
    >
        <div className="grid grid-cols-2 gap-4">
          <div className=" flex flex-col space-y-1 text-black">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
              >
                First Name
              </label>
            <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(e)=>
              setForm({...form,firstName:e.target.value})
            }
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

          </div>
            <div className="flex flex-col space-y-1 text-black">
              <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
              >
                Surname
              </label>
              <input
              id="lastName"
            type="text"
            placeholder="Enter last name"

            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

            </div>
        </div>


      <div className="flex flex-col space-y-1 text-black">
        <label 
        htmlFor="email"
        className="text-sm font-medium text-gray-700"
        >
          Email
    </label>
      <input
      id="email"
      type="email"
      placeholder="Enter your email"
      value={form.email}
      onChange={(e) => setForm({...form, email: e.target.value})}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      </div>

      <div className="flex flex-col space-y-1 text-black">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700"
          >
            Password
            </label>
      <input
      id="password"
      type="password"
      placeholder="Enter your password"
      value={form.password}
      onChange={(e) => setForm({...form, password: e.target.value})}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"

       />
       </div>

 <div className="flex flex-col space-y-1 text-black">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
          >
             Confirm Password
            </label>
      <input
      id="confrimPassword"
      type="password"
      placeholder="Please confirm your password"
      value={form.confirmPassword}
      onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"

       ></input>
       </div>


      <button
      type="submit"
        className="bg-gray-900 text-white font-medium py-2 rounded-md hover:bg-gray-800 transition"
      >
      Create Account</button>
    </form>
  );
}
