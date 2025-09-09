import type {
	RegisterMessageRequestDTO,
	RegisterMessageResponseDTO,
} from "@/services/Message/RegisterMessage/registerMessageDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function registerMessage(
	conversationId: string,
	payload: RegisterMessageRequestDTO
): Promise<RegisterMessageResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversations/${conversationId}/message-register`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to register message for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
