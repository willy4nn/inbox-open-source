import type {
	SendMessageRequestDTO,
	SendMessageResponseDTO,
} from "@/services/Message/SendMessage/sendMessageDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Send a message to a conversation, phone, or email
export async function sendMessage(
	type: "conversationId" | "phone" | "email",
	value: string,
	payload: SendMessageRequestDTO
): Promise<SendMessageResponseDTO> {
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
