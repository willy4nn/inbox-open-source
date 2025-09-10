"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { ConversationCard } from "@/components/ConversationCard";

export function ConversationsList() {
	const allConversations = useConversationsStore((s) => s.allConversations);
	const searchQuery = useConversationsStore((s) => s.searchQuery);
	const statusFilter = useConversationsStore((s) => s.statusFilter);

	const filteredConversations = allConversations.filter((conv) => {
		// Filtro de busca por texto
		const matchesSearch = searchQuery
			? (conv.aiUserIdentifier ?? conv.title ?? "")
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			: true;

		// Filtro por status ou não lidas
		const matchesStatus =
			statusFilter === "ALL"
				? true
				: statusFilter === "UNREAD"
				? (conv.unreadMessagesCount ?? 0) > 0
				: conv.status === statusFilter;

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
