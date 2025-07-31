"use client";

import { supabase } from "@/lib/supabaseClient";

type Props = {
  className?: string;
};

export default function LogoutButton({ className }: Props) {
  return (
    <button
      className={className}
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "auth/login";
      }}
    >
      Logout
    </button>
  );
}
