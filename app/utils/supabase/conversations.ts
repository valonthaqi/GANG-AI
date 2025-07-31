import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function createConversation(title: string) {
  const supabase = createClientComponentClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("conversations")
    .insert([{ title, user_id: session.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchConversations(userId: string) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
