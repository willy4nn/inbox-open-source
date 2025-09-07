import type { Conversation } from "@/types/conversation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch all conversations with optional filters
export async function listConversations(params?: {
	agentId?: string;
	createdAt?: string; // YYYY-MM-DD
	status?: "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
}): Promise<Conversation[]> {
	const query = new URLSearchParams();

	if (params?.agentId) query.append("agentId", params.agentId);
	if (params?.createdAt) query.append("createdAt", params.createdAt);
	if (params?.status) query.append("status", params.status);

	const res = await fetch(
		`${BASE_URL}/conversation${query.toString() ? `?${query.toString()}` : ""}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch conversations: ${res.statusText}`);
	}

	return res.json();
}

// Fetch conversation by ID
export async function fetchConversationById(conversationId: string): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversation/${conversationId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch conversation ${conversationId}: ${res.statusText}`);
  }

  return res.json();
}