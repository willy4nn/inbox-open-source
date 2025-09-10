"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { useSetAiEnabled } from "@/hooks/Conversation/useSetAiEnabled";
import { useSetConversationStatus } from "@/hooks/Conversation/useSetConversationStatus";
import { useSetConversationPriority } from "@/hooks/Conversation/useSetConversationPriority";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function OptionsPanel() {
	// Chamadas separadas
	const selectedConversation = useConversationsStore(
		(s) => s.selectedConversation
	);
	const setSelectedConversation = useConversationsStore(
		(s) => s.setSelectedConversation
	);

	const { setAiEnabled, isMutating: isAiMutating } = useSetAiEnabled();
	const { setStatus, isMutating: isStatusMutating } =
		useSetConversationStatus();
	const { setPriority, isMutating: isPriorityMutating } =
		useSetConversationPriority();

	if (!selectedConversation)
		return (
			<div className="w-64 border-l border-gray-200 p-4">
				<p>Selecione uma conversa para ver opções</p>
			</div>
		);

	const handleToggleAI = async () => {
		await setAiEnabled({
			conversationId: selectedConversation.id,
			payload: { enabled: !selectedConversation.isAiEnabled },
		});
		selectedConversation.isAiEnabled = !selectedConversation.isAiEnabled;
	};

	const handleStatusChange = async (value: string) => {
		const status = value as "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
		await setStatus({
			conversationId: selectedConversation.id,
			payload: { status },
		});
		selectedConversation.status = status;
	};

	const handlePriorityChange = async (value: string) => {
		const priority = value as "LOW" | "MEDIUM" | "HIGH";
		await setPriority({
			conversationId: selectedConversation.id,
			payload: { priority },
		});
		selectedConversation.priority = priority;
	};

	return (
		<div className="w-64 border-l border-gray-200 p-4 overflow-y-auto space-y-4">
			<h2 className="text-lg font-semibold mb-2">Opções</h2>

			<Button onClick={handleToggleAI} disabled={isAiMutating}>
				{selectedConversation.isAiEnabled
					? "Desativar AI"
					: "Ativar AI"}
			</Button>

			<div>
				<label className="block mb-1 font-medium">
					Status da Conversa
				</label>
				<Select
					value={selectedConversation.status ?? "UNRESOLVED"}
					onValueChange={handleStatusChange}
					disabled={isStatusMutating}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecione o status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="RESOLVED">Resolvida</SelectItem>
						<SelectItem value="UNRESOLVED">
							Não Resolvida
						</SelectItem>
						<SelectItem value="HUMAN_REQUESTED">
							Solicitar Humano
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<label className="block mb-1 font-medium">Prioridade</label>
				<Select
					value={selectedConversation.priority ?? "MEDIUM"}
					onValueChange={handlePriorityChange}
					disabled={isPriorityMutating}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecione a prioridade" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="LOW">Baixa</SelectItem>
						<SelectItem value="MEDIUM">Média</SelectItem>
						<SelectItem value="HIGH">Alta</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
