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
			className="border rounded p-3 mb-2 hover:bg-gray-100 cursor-pointer"
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
