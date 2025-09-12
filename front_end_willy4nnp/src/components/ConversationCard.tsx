// src/components/ConversationCard.tsx
"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { getConversationByIdResponseDTO as Conversation } from "@/services/Conversation/GetConversationById/getConversationByIdDTO";

export function ConversationCard({
	conversation,
}: {
	conversation: Conversation;
}) {
	const setSelectedConversation = useConversationsStore(
		(s) => s.setSelectedConversation
	);

	return (
		<div
			className="border rounded p-3 bg-[var(--background-200)] hover:bg-[var(--background-300)] hover:border-[var(--background-400)] border-[var(--background-300)] cursor-pointer"
			onClick={() => setSelectedConversation(conversation)}
		>
			<h3 className="font-semibold">
				{conversation.aiUserIdentifier ??
					conversation.title ??
					"Sem título"}
			</h3>
		</div>
	);
}
