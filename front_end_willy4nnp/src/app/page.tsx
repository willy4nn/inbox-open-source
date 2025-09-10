"use client";

import { useEffect } from "react";
import { useGetAllConversations } from "@/hooks/Conversation/useGetAllConversations";
import { useConversationsStore } from "@/store/useConversationsStore";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatContainer } from "@/components/ChatContainer";
import { OptionsPanel } from "@/components/OptionsPanel";

export default function Page() {
	const { conversations, isLoading } = useGetAllConversations();
	const setAllConversations = useConversationsStore(
		(s) => s.setAllConversations
	);

	useEffect(() => {
		if (conversations) setAllConversations(conversations);
	}, [conversations, setAllConversations]);

	if (isLoading) return <p>Carregando conversas...</p>;

	return (
		<div className="flex h-screen w-full bg-gray-50">
			<ConversationsList />
			<ChatContainer />
			<OptionsPanel />
		</div>
	);
}
