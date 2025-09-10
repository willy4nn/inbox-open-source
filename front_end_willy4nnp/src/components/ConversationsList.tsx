"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { ConversationCard } from "@/components/ConversationCard";

export function ConversationsList() {
	const { allConversations, searchQuery, statusFilter } =
		useConversationsStore();

	const filteredConversations = allConversations.filter((conv) => {
		const matchesSearch = searchQuery
			? (conv.aiUserIdentifier ?? conv.title ?? "")
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			: true;

		const matchesStatus =
			statusFilter === "ALL" ? true : conv.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	if (!allConversations || allConversations.length === 0)
		return <p>Carregando conversas...</p>;
	if (filteredConversations.length === 0)
		return <p>Nenhuma conversa encontrada.</p>;

	return (
		<div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
			<h2 className="text-lg font-semibold mb-4">Conversas</h2>
			{filteredConversations.map((conv) => (
				<ConversationCard key={conv.id} conversation={conv} />
			))}
		</div>
	);
}
