import type { GetMessagesResponseDTO } from "@/services/Message/GetMessages/getMessagesDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch messages from a conversation
export async function getMessages(
	conversationId: string,
	count: string
): Promise<GetMessagesResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversation/${conversationId}/messages/${count}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch messages: ${res.statusText}`);
	}

	const data = await res.json();

	// Map backend fields to our type
	const messages: GetMessagesResponseDTO = data.messages.map((msg: any) => ({
		id: msg.id,
		conversationId: msg.conversationId,
		sender: msg.from,
		text: msg.text,
		timestamp: msg.createdAt,
	}));

	return messages;
}
