import type { Message } from "@/types/message";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMessages(
	conversationId: string,
	count: string
): Promise<Message[]> {
	const res = await fetch(
		`${BASE_URL}/conversation/${conversationId}/messages/${count}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(`Falha ao buscar mensagens: ${res.statusText}`);
	}

	const data = await res.json();

	// 🔹 Mapear campos do backend para nosso type
	const messages: Message[] = data.messages.map((msg: any) => ({
		id: msg.id,
		conversationId: msg.conversationId,
		sender: msg.from,
		text: msg.text,
		timestamp: msg.createdAt,
	}));

	return messages;
}
