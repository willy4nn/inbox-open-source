import type {
	SetAiEnabledRequestDTO,
	SetAiEnabledResponseDTO,
} from "@/services/Conversation/SetAiEnabled/setAiEnabledDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Enable or disable AI for a conversation
export async function setAiEnabled(
	conversationId: string,
	payload: SetAiEnabledRequestDTO
): Promise<SetAiEnabledResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversations/${conversationId}/set-ai-enabled`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to update AI status for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
