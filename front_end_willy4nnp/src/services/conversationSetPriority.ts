// services/conversationSetPriority.ts
import type {
	SetPriorityRequest,
	SetPriorityResponse,
} from "@/types/conversationSetPriority";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define a prioridade de uma conversa
export async function setConversationPriority(
	conversationId: string,
	payload: SetPriorityRequest
): Promise<SetPriorityResponse> {
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
