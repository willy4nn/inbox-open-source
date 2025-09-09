import type { ConversationVariable } from "@/types/variable";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Buscar todas as variáveis customizadas de uma conversa
export async function getAllVariables(
	conversationId: string
): Promise<ConversationVariable[]> {
	const res = await fetch(`${BASE_URL}/variables/${conversationId}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!res.ok) {
		throw new Error(
			`Failed to fetch variables for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}

// 🔹 Buscar uma variável específica
export async function getOneVariable(
	conversationId: string,
	varName: string
): Promise<ConversationVariable> {
	const res = await fetch(
		`${BASE_URL}/variables/${conversationId}/${varName}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to fetch variable "${varName}" for conversation ${conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
