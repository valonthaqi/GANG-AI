import { supabase } from "@/lib/supabaseClient";

export async function saveMessage(
  conversation_id: string,
  role: "user" | "assistant",
  content: string
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id,
    role,
    content,
  });

  if (error) throw error;
}
