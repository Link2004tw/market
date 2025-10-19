"use client"

import RegisterForm from "../register/form";
import Link from "next/link";

export default function Register() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="shadow-xl p-6 bg-white rounded-xl w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center text-black">Create Your Account Now</h1>
        <RegisterForm />
        <p className="text-center text-sm text-gray-900 mt-4">
            Have an account?{" "}
             <Link href="/login" className="text-blue-600 underline">
             Sign in
             </Link>
        </p>
      </div>
    </div>
  );
}
