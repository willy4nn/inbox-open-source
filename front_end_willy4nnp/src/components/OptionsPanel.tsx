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
			<div className="h-full w-64 border-l p-4 overflow-y-auto space-y-4 bg-[var(--background-100)] border-[var(--background-200)]">
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
		<div className="h-full w-64 border-l p-4 overflow-y-auto space-y-4 bg-[var(--background-100)] border-[var(--background-200)]">
			<h2 className="text-lg font-semibold mb-2">Opções</h2>

			<Button
				onClick={handleToggleAI}
				disabled={isAiMutating}
				className="w-full cursor-pointer"
			>
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
					<SelectTrigger className="w-full text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2">
						<SelectValue placeholder="Selecione o status" />
					</SelectTrigger>
					<SelectContent className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]">
						<SelectItem
							className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
							value="RESOLVED"
						>
							Resolvida
						</SelectItem>
						<SelectItem
							className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
							value="UNRESOLVED"
						>
							Não Resolvida
						</SelectItem>
						<SelectItem
							className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
							value="HUMAN_REQUESTED"
						>
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
					<SelectTrigger className="w-full text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2">
						<SelectValue placeholder="Selecione a prioridade" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							className="w-full text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2"
							value="LOW"
						>
							Baixa
						</SelectItem>
						<SelectItem
							className="w-full text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2"
							value="MEDIUM"
						>
							Média
						</SelectItem>
						<SelectItem
							className="w-full text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2"
							value="HIGH"
						>
							Alta
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
