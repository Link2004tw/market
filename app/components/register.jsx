"use client";

import RegisterForm from "../register/form";
import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4">
      <div className="shadow-xl p-10 bg-white rounded-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-semibold underline mb-8 text-center text-gray-900">
          Register
        </h1>
        {/* Registration form (includes profile picture section) */}
        <RegisterForm />

        {/* Sign-in link */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium underline hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

