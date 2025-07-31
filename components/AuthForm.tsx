"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fn =
      type === "login"
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { error } = await fn({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/chat");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-32 p-6 bg-white rounded shadow space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">
        {type === "login" ? "Log In" : "Sign Up"}
      </h1>
      <input
        type="email"
        required
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        {type === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
}
