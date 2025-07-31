"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-20 bg-[#f5f5f5] border-r flex flex-col items-center justify-between py-6">
      {/* Top Logo or Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300" />

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-6 text-sm text-gray-700">
        <Link
          href="/dashboard"
          className="flex flex-col items-center hover:text-black"
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </Link>
      </nav>

      {/* Optional bottom icons */}
      <div className="text-xs text-gray-400">N</div>
    </div>
  );
}
