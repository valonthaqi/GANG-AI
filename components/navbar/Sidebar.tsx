"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchConversations } from "../../app/utils/supabase/conversations";

type Conversation = {
  id: string;
  title: string;
};

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadConvos = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("👤 user:", user);
      if (!user?.id) {
        console.warn("⚠️ No user ID");
        return;
      }

      try {
        const data = await fetchConversations(user.id);
        setConversations(data);
      } catch (err) {
        console.error("❌ Failed to fetch conversations:", err);
      }
    };

    loadConvos();
  }, []);
  
  

  return (
    <div className="h-screen w-60 bg-[#f5f5f5] border-r flex flex-col justify-between py-6 px-4">
      {/* Top logo/avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-300 mb-6" />

      {/* Navigation */}
      <nav className="flex flex-col gap-3 text-sm text-gray-700">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:text-black"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">
          Your Conversations
        </div>
        {conversations.length > 0 ? (
          conversations.map((c) => (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              className="text-gray-700 hover:text-black text-sm truncate"
            >
              {c.title}
            </Link>
          ))
        ) : (
          <span className="text-xs text-gray-400">No conversations</span>
        )}
      </nav>

      {/* Bottom corner */}
      <div className="text-xs text-gray-400 text-center">© 2025</div>
      </div>
      
  );
}
