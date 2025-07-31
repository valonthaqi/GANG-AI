"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) return setError(error.message);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fc] to-[#edf2f7] relative overflow-hidden">
      <div className="absolute left-[-80px] bottom-0 w-1/2 h-1 bg-teal-400 rotate-[-10deg]"></div>
      <div className="absolute right-[-80px] bottom-0 w-1/2 h-1 bg-teal-400 rotate-[10deg]"></div>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md z-10">
        <h3 className="text-sm text-gray-600">Welcome! 🎉</h3>
        <h1 className="text-2xl text-black font-bold mb-6">
          Create a new account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Your email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition cursor-pointer"
          >
            CONTINUE
          </button>
        </form>

        <div className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
