"use client";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TestUser() {
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      console.log("👤 user:", user);
      if (error) console.error("🔴 error:", error);
    };

    fetchUser();
  }, []);

  return <div>Check console for user</div>;
}
