"use client";

import { useGetAllConversations } from "@/hooks/Conversation/useGetAllConversations";
import { useConversationStore } from "@/store/useConversationStore";

type ConversationCardProps = {
	id: string;
	title: string;
	conversation: any;
};

function ConversationCard({ conversation, title }: ConversationCardProps) {
	const setSelectedConversation = useConversationStore(
		(s) => s.setSelectedConversation
	);

	return (
		<div
			className="border rounded p-3 mb-2 hover:bg-gray-100 cursor-pointer"
			onClick={() => setSelectedConversation(conversation)}
		>
			<h3 className="font-semibold">{title}</h3>
		</div>
	);
}

export function ConversationsList() {
	const { conversations, isLoading, isError } = useGetAllConversations();

	if (isLoading) return <p>Carregando conversas...</p>;
	if (isError) return <p>Erro ao carregar conversas.</p>;
	if (!conversations || conversations.length === 0)
		return <p>Nenhuma conversa encontrada.</p>;

	return (
		<div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
			<h2 className="text-lg font-semibold mb-4">Conversas</h2>
			{conversations.map((conv) => (
				<ConversationCard
					key={conv.id}
					conversation={conv}
					title={conv.aiUserIdentifier ?? "Sem título"}
					id={conv.id}
				/>
			))}
		</div>
	);
}
