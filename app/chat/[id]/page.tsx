"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { fetchMessages, saveMessage, MessageRecord } from "@/app/utils/supabase/messages";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/login");
        return;
      }
      try {
        const dataMessages = await fetchMessages(conversationId);
        setMessages(dataMessages.map((m: MessageRecord) => ({ role: m.role, content: m.content })));
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
      setLoading(false);
    };
    load();
  }, [router, conversationId]);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userContent = input;
    const newMessages = [...messages, { role: "user", content: userContent }];
    setMessages(newMessages);
    setInput("");

    try {
      await saveMessage({ conversation_id: conversationId, role: "user", content: userContent });
    } catch (err) {
      console.error("Failed to save user message", err);
    }

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const aiMsg = data.message;
      setMessages((prev) => [...prev, { role: "assistant", content: aiMsg }]);
      await saveMessage({ conversation_id: conversationId, role: "assistant", content: aiMsg });
    } catch {
      const errorMsg = "⚠️ Failed to fetch AI response.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      try {
        await saveMessage({ conversation_id: conversationId, role: "assistant", content: errorMsg });
      } catch {
        // ignore
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-10">
      <h1 className="text-2xl text-black font-semibold mb-6">Your conversation</h1>
      <div className="w-full max-w-3xl flex flex-col h-[75vh] text-black">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-xl whitespace-pre-wrap ${
                msg.role === "user" ? "bg-gray-200 text-right ml-auto" : "bg-gray-100 text-left mr-auto"
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
    </div>
  );
}
