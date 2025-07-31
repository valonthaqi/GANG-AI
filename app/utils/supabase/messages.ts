import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function saveMessage({
  conversation_id,
  role,
  content,
}: {
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
}) {
  const supabase = createClientComponentClient();
  const { error } = await supabase.from("messages").insert([
    {
      conversation_id,
      role,
      content,
    },
  ]);

  if (error) throw error;
}
