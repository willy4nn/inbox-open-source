export type MessageSender = "human" | "agent";

export interface RegisterMessageRequest {
	message: string;
	from: MessageSender;
}

export interface Message {
	id: string;
	conversationId: string;
	text: string;
	from: string;
	createdAt: string;
}

export interface RegisterMessageResponse {
	success: boolean;
	message: Message;
}
