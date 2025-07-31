"use client";

import { useRouter } from "next/navigation";
import {  Settings } from "lucide-react";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-end items-center px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/settings")}
          className="hover:opacity-80 cursor-pointer"
        >
          <Settings size={22} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:opacity-90 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
