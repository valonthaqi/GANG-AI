"use client";

import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface Props {
  children: React.ReactNode;
}

export default function SupabaseProvider({ children }: Props) {
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
