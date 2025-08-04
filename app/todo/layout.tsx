"use client";

import Sidebar from "@/components/navbar/Sidebar";
import Topbar from "@/components/navbar/Topbar";
import type { ReactNode } from "react";
import { SidebarRefreshContext } from "../context/SidebarRefreshContext";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [refreshSignal, setRefreshSignal] = useState(false);

  const triggerSidebarRefresh = () => {
    setRefreshSignal((prev) => !prev);
  };

  return (
    <SidebarRefreshContext.Provider value={{ triggerSidebarRefresh }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar refreshSignal={refreshSignal} />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 bg-[#fafafa] p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarRefreshContext.Provider>
  );
}
