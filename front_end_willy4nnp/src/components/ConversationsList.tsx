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

	const activeCustomFilter = filters.find((f) => f.id === selectedFilter);

	const filteredConversations = allConversations.filter(
		(conv: getConversationByIdResponseDTO) => {
			const titleContent = conv.aiUserIdentifier ?? conv.title ?? "";

			// Busca
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

			// Status
			const matchesStatus =
				statusFilter === "ALL"
					? true
					: statusFilter === "UNREAD"
					? (conv.unreadMessagesCount ?? 0) > 0
					: conv.status === statusFilter;

			// Filtros customizados
			const matchesCustom =
				!activeCustomFilter ||
				[
					!activeCustomFilter.canal ||
						conv.channel === activeCustomFilter.canal,
					!activeCustomFilter.agenteIA ||
						conv.agentId === activeCustomFilter.agenteIA,
					!activeCustomFilter.prioridade ||
						conv.priority === activeCustomFilter.prioridade,
					!activeCustomFilter.statusIA ||
						(conv.isAiEnabled ? "ENABLED" : "DISABLED") ===
							activeCustomFilter.statusIA,
					!activeCustomFilter.cenarioCRM ||
						(conv.crmScenarioConversations?.some(
							(s) =>
								activeCustomFilter.cenarioCRM &&
								JSON.stringify(s).includes(
									activeCustomFilter.cenarioCRM
								)
						) ??
							false),
					activeCustomFilter.nivelInsatisfacao === undefined ||
						conv.frustration ===
							activeCustomFilter.nivelInsatisfacao,
					!activeCustomFilter.etiquetas?.length ||
						activeCustomFilter.etiquetas.every(
							(tag) =>
								conv.conversationVariables?.some(
									(v) =>
										v.varName === "tag" &&
										v.varValue === tag
								) ?? false
						),
				].every(Boolean);

			// Filtro pelo email do assignee
			const matchesAssignee = activeCustomFilter?.responsavel
				? conv.assignees?.some(
						(a) => a.user?.email === activeCustomFilter.responsavel
				  ) ?? false
				: true;

			return (
				matchesSearch &&
				matchesStatus &&
				matchesCustom &&
				matchesAssignee
			);
		}
	);

	if (!allConversations || allConversations.length === 0)
		return <p>Carregando conversas...</p>;
	if (filteredConversations.length === 0)
		return <p>Nenhuma conversa encontrada.</p>;

	return (
		<div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
			<h2 className="text-lg font-semibold mb-4">
				{activeCustomFilter?.responsavel
					? `Conversas atribuídas a ${activeCustomFilter.responsavel}`
					: "Todas as conversas"}
			</h2>
			{filteredConversations.map((conv) => (
				<ConversationCard key={conv.id} conversation={conv} />
			))}
		</div>
	);
}
