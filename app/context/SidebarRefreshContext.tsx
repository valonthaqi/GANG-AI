"use client";

import { createContext, useContext } from "react";

type SidebarRefreshContextType = {
  triggerSidebarRefresh: () => void;
};

export const SidebarRefreshContext = createContext<SidebarRefreshContextType>({
  triggerSidebarRefresh: () => {},
});

export const useSidebarRefresh = () => useContext(SidebarRefreshContext);
    