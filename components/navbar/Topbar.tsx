"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";


export default function Topbar() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) console.error("Failed to fetch avatar:", error.message);

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
      {/* ✅ LEFT side: avatar + email */}
      <div className="flex items-center gap-3">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-gray-800">{email}</span>
      </div>

      {/* ✅ RIGHT side: settings + logout */}
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
