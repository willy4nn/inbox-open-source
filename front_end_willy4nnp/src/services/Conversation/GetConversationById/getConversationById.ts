import type {
	getConversationByIdRequestDTO,
	getConversationByIdResponseDTO,
} from "@/services/Conversation/GetConversationById/getConversationByIdDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getConversationById(
	params: getConversationByIdRequestDTO
): Promise<getConversationByIdResponseDTO> {
	const res = await fetch(
		`${BASE_URL}/conversation/${params.conversationId}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(
			`Failed to fetch conversation ${params.conversationId}: ${res.statusText}`
		);
	}

	return res.json();
}
