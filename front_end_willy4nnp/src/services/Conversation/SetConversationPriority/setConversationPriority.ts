import type {
	SetPriorityRequestDTO,
	SetPriorityResponseDTO,
} from "@/services/Conversation/SetConversationPriority/setConversationPriorityDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Set the priority of a conversation
export async function setConversationPriority(
	conversationId: string,
	payload: SetPriorityRequestDTO
): Promise<SetPriorityResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversations/${conversationId}/set-priority`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to set priority for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
