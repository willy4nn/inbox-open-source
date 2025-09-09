import type { GetOneVariableResponseDTO } from "@/services/Variable/GetOneVariable/getOneVariableDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch a single variable from a conversation
export async function getOneVariable(
	conversationId: string,
	varName: string
): Promise<GetOneVariableResponseDTO> {
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
