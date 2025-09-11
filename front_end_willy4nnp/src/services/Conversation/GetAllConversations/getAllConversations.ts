import type {
	getAllConversationsRequestDTO,
	getAllConversationsResponseDTO,
} from "@/services/Conversation/GetAllConversations/getAllConversationsDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch all conversations with optional filters
export async function getAllConversations(
	params?: getAllConversationsRequestDTO
): Promise<getAllConversationsResponseDTO> {
	const query = new URLSearchParams();

	if (params) {
		if ("agentId" in params && params.agentId) {
			query.append("agentId", params.agentId);
		}
		if ("createdAt" in params && params.createdAt) {
			query.append("createdAt", params.createdAt);
		}
		if ("status" in params && params.status) {
			query.append("status", params.status);
		}
	}

	const res = await fetch(
		`${BASE_URL}/conversation${
			query.toString() ? `?${query.toString()}` : ""
		}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch conversations: ${res.statusText}`);
	}

	const data: getAllConversationsResponseDTO = await res.json();

	// 🔹 Loga o resultado puro da API
	console.log("📥 Resultado bruto da API (getAllConversations):", data);

	return data;
}
