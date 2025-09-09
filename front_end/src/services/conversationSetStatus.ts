import type {
	SetStatusRequest,
	SetStatusResponse,
} from "@/types/conversationSetStatus";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define o status de uma conversa
export async function setConversationStatus(
	conversationId: string,
	payload: SetStatusRequest
): Promise<SetStatusResponse> {
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
