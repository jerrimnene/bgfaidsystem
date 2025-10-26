"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Message {
  id: number;
  sender: string;
  content: string;
  sent_at: string;
}

export default function MessageThread() {
  const params = useParams();
  const id = params?.id as string | undefined;   // ✅ safer for TypeScript
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`http://localhost:3001/api/v1/messages/${id}`);
        const data = await res.json();
        if (data.success) setMessages(data.data);
      } catch {
        console.error("⚠️ Could not load messages.");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [id]);

  async function sendMessage() {
    if (!newMessage.trim()) return;
    const res = await fetch(`http://localhost:3001/api/v1/messages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: localStorage.getItem("user_email") || "program.manager@bgf.com",
        content: newMessage,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessages([...messages, data.data]);
      setNewMessage("");
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading chat...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">💬 Application Chat</h1>
      <div className="border rounded-lg p-4 bg-gray-50 h-96 overflow-y-scroll">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-3">
              <p className="text-sm text-gray-600">
                <strong>{msg.sender}</strong>{" "}
                <span className="text-xs text-gray-400">
                  {new Date(msg.sent_at).toLocaleString()}
                </span>
              </p>
              <p className="text-gray-800">{msg.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
