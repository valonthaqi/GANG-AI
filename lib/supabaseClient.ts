"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import type { Database } from "@/types/supabase"; // optional typing

// If you're using custom types:
// export const supabase = createClientComponentClient<Database>();

// If not using custom types, just use this:
export const supabase = createClientComponentClient();
