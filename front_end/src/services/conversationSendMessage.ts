import type {
	SendMessageRequest,
	SendMessageResponse,
	IdentifierType,
} from "@/types/conversationSendMessage";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Envia uma mensagem para uma conversa, número ou email
export async function sendMessage(
	type: IdentifierType,
	value: string,
	payload: SendMessageRequest
): Promise<SendMessageResponse> {
	const res = await fetch(
		`${BASE_URL}/conversation/message/${type}/${value}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to send message to ${type} ${value}: ${res.statusText}`
		);
	}

	return res.json();
}
