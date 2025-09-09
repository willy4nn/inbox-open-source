import type {
	RegisterMessageRequest,
	RegisterMessageResponse,
} from "@/types/conversationRegisterMessage";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Registrar uma mensagem em uma conversa
export async function registerMessage(
	conversationId: string,
	payload: RegisterMessageRequest
): Promise<RegisterMessageResponse> {
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
