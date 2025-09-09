export type ConversationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface SetPriorityRequest {
	priority: ConversationPriority;
}

export interface SetPriorityResponse {
	success: boolean;
	message: string;
}
