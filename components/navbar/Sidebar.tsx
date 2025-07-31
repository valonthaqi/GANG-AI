"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, MessageSquare, Trash2, Pencil } from "lucide-react";
import { fetchConversations, deleteConversation, updateConversationTitle } from "@/app/utils/supabase/conversations"; 



type Conversation = {
  id: string;
  title: string;
};

type Props = {
  refreshSignal?: boolean;
};

export default function Sidebar({ refreshSignal }: Props) {
  const router = useRouter();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [ showDropdown, setShowDropdown ] = useState( false );
  const [ editingId, setEditingId ] = useState<string | null>( null );
  const [ editValue, setEditValue ] = useState<string>( "" );
  const [warning, setWarning] = useState<string | null>(null);



  const loadConvos = async () => {
    const data = await fetchConversations();
    setConvos(data);
  };

  useEffect(() => {
    loadConvos();
  }, []);

  useEffect(() => {
    if (refreshSignal) {
      loadConvos(); // refresh if new convo created
    }
  }, [refreshSignal]);

  return (
    <div className="h-screen w-20 bg-[#f5f5f5] border-r flex flex-col items-center justify-between py-6 relative">
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          onClick={() => {
            router.push("/dashboard"); // start new chat
          }}
          className="hover:text-black text-gray-700"
          title="New Chat"
        >
          <Home size={22} />
        </button>

        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="hover:text-black text-gray-700"
          title="Your Conversations"
        >
          <MessageSquare size={20} />
        </button>

        {showDropdown && convos.length > 0 && (
          <div className="absolute top-[90px] left-20 bg-white shadow-lg border rounded-lg p-2 space-y-1 z-50 max-w-[300px]">
            {convos.map((convo) => (
              <div
                key={convo.id}
                className="flex items-center justify-between gap-1 hover:bg-gray-100 rounded whitespace-nowrap"
              >
                {editingId === convo.id ? (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        const words = e.target.value.trim().split(/\s+/);
                        if (value.length > 30) {
                          setWarning("Title cannot exceed 30 characters.");
                        } else if (words.length > 6) {
                          setWarning("Title cannot exceed 6 words.");
                        } else {
                          setWarning(null);
                          setEditValue(value);
                        }
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          const trimmed = editValue.trim();
                          const wordCount = trimmed.split(/\s+/).length;

                          if (trimmed === "") {
                            setWarning("Title cannot be empty.");
                            return;
                          }

                          if (wordCount > 6) {
                            setWarning("Title cannot exceed 6 words.");
                            return;
                          }

                          try {
                            await updateConversationTitle(convo.id, trimmed);
                            setEditingId(null);
                            loadConvos();
                            setWarning(null);
                          } catch (err) {
                            console.error("Rename failed", err);
                          }
                        }
                      }}
                      className="text-sm px-2 py-1 w-full text-black rounded border border-gray-300"
                      autoFocus
                    />

                    {warning && (
                      <p className="text-xs text-red-500 px-2 mt-1">
                        {warning}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      router.push(`/dashboard?conversationId=${convo.id}`);
                      setShowDropdown(false);
                    }}
                    className="text-left text-sm px-3 py-1 text-black "
                  >
                    {convo.title}
                  </button>
                )}

                {editingId !== convo.id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(convo.id);
                        setEditValue(convo.title);
                      }}
                      className="p-1 rounded ms-auto"
                      title="Rename"
                    >
                      <Pencil
                        size={14}
                        className="text-blue-500 hover:text-blue-700"
                      />
                    </button>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await deleteConversation(convo.id);
                          loadConvos();
                          if (window.location.href.includes(convo.id)) {
                            router.push("/dashboard");
                          }
                        } catch (err) {
                          console.error("Failed to delete conversation", err);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2
                        size={14}
                        className="text-red-500 hover:text-red-700"
                      />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
