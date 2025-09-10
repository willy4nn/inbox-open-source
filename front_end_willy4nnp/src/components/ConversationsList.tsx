"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useCustomFiltersStore } from "@/store/useCustomFiltersStore";
import { ConversationCard } from "@/components/ConversationCard";
import type { getConversationByIdResponseDTO } from "@/services/Conversation/GetConversationById/getConversationByIdDTO";

export function ConversationsList() {
	const { allConversations, searchQuery, statusFilter } =
		useConversationsStore();
	const { messagesByConversation } = useMessagesStore();
	const { filters, selectedFilter } = useCustomFiltersStore();

	// Filtro customizado selecionado
	const activeCustomFilter = filters.find((f) => f.id === selectedFilter);

	const filteredConversations = allConversations.filter(
		(conv: getConversationByIdResponseDTO) => {
			const titleContent = conv.aiUserIdentifier ?? conv.title ?? "";

			// 🔎 Busca no título ou nas mensagens
			const matchesSearch = searchQuery
				? titleContent
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
				  (messagesByConversation[conv.id] || []).some((msg) =>
						msg.text
							.toLowerCase()
							.includes(searchQuery.toLowerCase())
				  )
				: true;

			// 📌 Filtro rápido por status
			const matchesStatus =
				statusFilter === "ALL"
					? true
					: statusFilter === "UNREAD"
					? (conv.unreadMessagesCount ?? 0) > 0
					: conv.status === statusFilter;

			// 🛠️ Filtros customizados
			const matchesCustom =
				!activeCustomFilter ||
				(
					[
						// Usuário responsável → checa assignees
						!activeCustomFilter.responsavel ||
							(conv.assignees?.some(
								(a: { id?: string }) =>
									a.id === activeCustomFilter.responsavel
							) ??
								false),

						// Canal
						!activeCustomFilter.canal ||
							conv.channel === activeCustomFilter.canal,

						// Agente de IA → usa agentId
						!activeCustomFilter.agenteIA ||
							conv.agentId === activeCustomFilter.agenteIA,

						// Prioridade
						!activeCustomFilter.prioridade ||
							conv.priority === activeCustomFilter.prioridade,

						// Status da IA na conversa
						!activeCustomFilter.statusIA ||
							(conv.isAiEnabled ? "ENABLED" : "DISABLED") ===
								activeCustomFilter.statusIA,

						// Cenário CRM
						!activeCustomFilter.cenarioCRM ||
							(conv.crmScenarioConversations?.some(
								(s: unknown) =>
									activeCustomFilter.cenarioCRM !==
										undefined &&
									JSON.stringify(s).includes(
										activeCustomFilter.cenarioCRM
									)
							) ??
								false),

						// Nível de Insatisfação → frustration
						activeCustomFilter.nivelInsatisfacao === undefined ||
							conv.frustration ===
								activeCustomFilter.nivelInsatisfacao,

						// Etiquetas (salvas em conversationVariables como varName = "tag")
						!activeCustomFilter.etiquetas?.length ||
							activeCustomFilter.etiquetas.every(
								(tag: string) =>
									conv.conversationVariables?.some(
										(v: {
											varName: string;
											varValue: string;
										}) =>
											v.varName === "tag" &&
											v.varValue === tag
									) ?? false
							),
					] as boolean[]
				).every(Boolean);

			return matchesSearch && matchesStatus && matchesCustom;
		}
	);

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
