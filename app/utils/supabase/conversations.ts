import { supabase } from "@/lib/supabaseClient";

export async function createConversation(title?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get how many convos user already has
  const { count } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const name = title || `Convo ${count! + 1}`;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title: name })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
export async function fetchConversations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return data || [];
}
  
export async function deleteConversation(id: string) {
  const { error } = await supabase.from("conversations").delete().eq("id", id);

  if (error) throw error;
}
export async function updateConversationTitle(id: string, title: string) {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id);

  if (error) throw error;
}