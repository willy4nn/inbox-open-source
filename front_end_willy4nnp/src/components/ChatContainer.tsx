"use client";

import { useConversationStore } from "@/store/useConversationStore";
import { useGetMessages } from "@/hooks/Message/useGetMessages";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function ChatContainer() {
	const selectedConversation = useConversationStore(
		(s) => s.selectedConversation
	);

	const { messages, isLoading, isError } = useGetMessages(
		selectedConversation ? selectedConversation.id : null,
		"1000"
	);

	if (!selectedConversation)
		return <p>Selecione uma conversa para abrir o chat</p>;
	if (isLoading) return <p>Carregando mensagens...</p>;
	if (isError) return <p>Erro ao carregar mensagens.</p>;

	return (
		<div className="flex-1 p-4 overflow-y-auto">
			<h2 className="text-lg font-semibold mb-4">
				{selectedConversation.aiUserIdentifier ?? "Sem título"}
			</h2>
			<div className="space-y-2">
				{messages?.map((msg) => (
					<div key={msg.id} className="p-2 border rounded">
						<p>
							<strong>{msg.sender}:</strong> {msg.text}
						</p>
						<span className="text-xs text-gray-400">
							{dayjs(msg.timestamp).fromNow()}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
