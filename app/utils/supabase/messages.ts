import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type MessageRecord = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
};

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

export async function fetchMessages(conversationId: string): Promise<MessageRecord[]> {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
