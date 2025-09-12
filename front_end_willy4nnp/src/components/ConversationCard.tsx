"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { getConversationByIdResponseDTO as Conversation } from "@/services/Conversation/GetConversationById/getConversationByIdDTO";
import dayjs from "dayjs";

export function ConversationCard({
	conversation,
}: {
	conversation: Conversation;
}) {
	const setSelectedConversation = useConversationsStore(
		(s) => s.setSelectedConversation
	);
	const selectedConversation = useConversationsStore(
		(s) => s.selectedConversation
	);

	const isSelected = selectedConversation?.id === conversation.id;

	const lastUpdated = conversation.updatedAt
		? dayjs(conversation.updatedAt).format("DD/MM/YYYY HH:mm")
		: "—";

	// Barrinha de frustração (0 a 1)
	const frustrationPercent = conversation.frustration
		? Math.min(Math.max(conversation.frustration, 0), 1) * 100
		: 0;

	return (
		<div
			className={`border rounded p-3 cursor-pointer transition-all duration-200 ease-in-out
				${
					isSelected
						? "bg-[var(--background-300)] border-[var(--background-400)] shadow-md"
						: "bg-[var(--background-200)] border-[var(--background-300)] hover:bg-[var(--background-300)] hover:border-[var(--background-400)]"
				}`}
			onClick={() => setSelectedConversation(conversation)}
		>
			<h3 className="font-semibold mb-2 transition-colors duration-200 ease-in-out">
				{conversation.aiUserIdentifier ??
					conversation.title ??
					"Sem título"}
			</h3>

			<div className="text-xs text-[var(--foreground-500)] mb-2 transition-colors duration-200 ease-in-out">
				{lastUpdated}
			</div>

			{/* Barrinha de frustração com gradiente */}
			{conversation.frustration !== undefined && (
				<div className="w-full h-1 bg-[var(--background-400)] rounded overflow-hidden">
					<div
						className="h-2 rounded transition-all duration-200 ease-in-out"
						style={{
							width: `${frustrationPercent}%`,
							background: `linear-gradient(
								to right,
								rgb(34,197,94),
								rgb(250,204,21),
								rgb(239,68,68)
							)`,
						}}
					></div>
				</div>
			)}
		</div>
	);
}
