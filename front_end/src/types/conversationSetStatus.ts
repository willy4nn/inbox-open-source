// types/conversationSetStatus.ts

export type ConversationStatus = "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";

export interface SetStatusRequest {
	status: ConversationStatus;
}

export interface SetStatusResponse {
	success: boolean;
	message: string;
}
