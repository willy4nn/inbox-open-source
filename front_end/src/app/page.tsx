"use client";
import CardConversation from "@/components/CardConversation";
import type {Conversation as ConversationType} from "@/components/CardConversation/types";
import useQuery from "@/hooks/useQuery";
import Image from "next/image";
import { use } from "react";

export default function Home() {
  const [data, error, loading] = useQuery<ConversationType[]>('conversations', 'http://localhost:3001/conversation', {
    method: 'GET',
  });
  return (
    <div className="flex h-screen p-2 w-full">
      <aside className="flex flex-col max-w-64 h-full bg-white/3 text-white p-4 rounded-2xl overflow-auto space-y-4 flex-1">
        {data && data.length > 0 ? (
          data.map((conversation) => (
            <CardConversation key={conversation.id} value={conversation} />
          ))
        ) : (
          <p>No conversations found.</p>
        )}
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="mb-4">This is the main content area.</p>
        <p className="flex w-full wrap-anywhere">{JSON.stringify(data)}</p>
      </main>
    </div>
  );
}
