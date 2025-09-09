import type {
	SetStatusRequestDTO,
	SetStatusResponseDTO,
} from "@/services/Conversation/SetConversationStatus/setConversationStatusDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Set the status of a conversation
export async function setConversationStatus(
	conversationId: string,
	payload: SetStatusRequestDTO
): Promise<SetStatusResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversations/${conversationId}/set-status`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to set status for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
