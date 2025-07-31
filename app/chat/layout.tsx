import Sidebar from "@/components/navbar/Sidebar";
import Topbar from "@/components/navbar/Topbar";
import type { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-[#fafafa] p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
