"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { createConversation } from "@/app/utils/supabase/conversations";
import { saveMessage } from "@/app/utils/supabase/messages";
import { useSearchParams } from "next/navigation";
import { useSidebarRefresh } from "../context/SidebarRefreshContext";



export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
    const textareaRef = useRef<HTMLTextAreaElement>( null );
    const [ conversationId, setConversationId ] = useState<string | null>( null );
    const searchParams = useSearchParams();
    const selectedConvoId = searchParams.get( "conversationId" );
    const { triggerSidebarRefresh } = useSidebarRefresh();

    


    useEffect(() => {
      const loadDashboard = async () => {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          router.push("/auth/login");
          return;
        }

        if (selectedConvoId) {
          const { data } = await supabase
            .from("messages")
            .select("role, content")
            .eq("conversation_id", selectedConvoId)
            .order("created_at", { ascending: true });

          if (data) {
            setConversationId(selectedConvoId);
            setMessages(
              data as { role: "user" | "assistant"; content: string }[]
            );
          }
        } else {
          // Clear convo + messages for new chat
          setConversationId(null);
          setMessages([]);
        }

        setLoading(false);
      };

      loadDashboard();
    }, [router, selectedConvoId]);
      

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: { role: "user" | "assistant"; content: string }[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      // Create conversation if not exists
      let currentConversationId = conversationId;

      if (!currentConversationId) {
        // Ask AI for a title based on the user's first input
        const titlePrompt = `Create a short, clear chat title (max 6 words) based on this question:\n"${input}"`;

        const titleResponse = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: titlePrompt }],
          }),
        });

        const titleData = await titleResponse.json();
        const aiTitle = titleData.message.trim().replace(/[.?!]$/, ""); // remove ending punctuation

        // Create conversation with AI-generated title
        const convo = await createConversation(aiTitle);
        currentConversationId = convo.id;
        setConversationId(currentConversationId);
        triggerSidebarRefresh();
      }
      

      // ✅ TypeScript-safe guard clause
      if (!currentConversationId) {
        console.error("❌ conversationId is still null");
        return;
      }

      // Save user message
      await saveMessage(currentConversationId, "user", input);

      // Fetch assistant response
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const aiReply = data.message;

      const updatedMessages: { role: "user" | "assistant"; content: string }[] =
        [...newMessages, { role: "assistant", content: aiReply }];
      setMessages(updatedMessages);

      // Save assistant message
      await saveMessage(currentConversationId, "assistant", aiReply);
    } catch (error) {
        console.error("❌ AI request failed:", error);
      
        const failMessage: { role: "user" | "assistant"; content: string } = {
          role: "assistant",
          content: "⚠️ Failed to fetch AI response.",
        };
      
        setMessages((prev) => [...prev, failMessage]);
      
        if (conversationId) {
          await saveMessage(conversationId, "assistant", failMessage.content);
        }
      }
  };
  

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-10">
      <h1 className="text-2xl text-black font-semibold mb-6">
        What can I help with?
      </h1>

      <div className="w-full max-w-3xl flex flex-col h-[75vh] text-black">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-xl whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gray-200 text-right ml-auto"
                  : "bg-gray-100 text-left mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end gap-2 bg-white rounded-xl border border-gray-300 shadow px-4 py-3">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 resize-none overflow-hidden text-black text-base bg-transparent focus:outline-none leading-tight pt-3 pb-2"
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 w-[40px] transition cursor-pointer self-center"
          >
            <span className="font-bold text-lg leading-none">↑</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6 max-w-md">
        You’ve hit the Free plan limit for The Gang AI. Subscribe to Pro plan to
        increase limits.
        <br />
        AI can make mistakes. Please double-check responses.
      </p>
    </div>
  );
}
