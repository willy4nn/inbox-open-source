import type {
	ConversationVariable,
	DeleteVariableResponse,
} from "@/types/variable";

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

export async function upsertVariable(
	conversationId: string,
	varName: string,
	varValue: string
): Promise<ConversationVariable> {
	const res = await fetch(`${BASE_URL}/variables`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ conversationId, varName, varValue }),
	});

	if (!res.ok) {
		throw new Error(
			`Failed to upsert variable "${varName}": ${res.statusText}`
		);
	}

	return res.json();
}

export async function deleteVariable(
	conversationId: string,
	varName: string
): Promise<DeleteVariableResponse> {
	const url = `${BASE_URL}/variables/${encodeURIComponent(
		conversationId
	)}/${encodeURIComponent(varName)}`;

	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // se precisar passar
		},
	});

	let data: DeleteVariableResponse | { error: string };

	try {
		data = await response.json();
	} catch {
		throw new Error(
			"Falha ao deletar a variável: resposta inválida do servidor"
		);
	}

	if (!response.ok) {
		throw new Error(
			(data as { error: string }).error || "Falha ao deletar a variável"
		);
	}

	return data as DeleteVariableResponse;
}
