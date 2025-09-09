export type MessageSender = "human" | "agent";

export type MessageChannel =
	| "website"
	| "dashboard"
	| "whatsapp"
	| "zapi"
	| "telegram"
	| "instagramDm";

export type IdentifierType = "conversationId" | "phone" | "email";

export interface MessageAttachment {
	url: string;
	name: string;
	mimeType: string;
}

export interface SendMessageRequest {
	message: string;
	agentId?: string;
	channel?: MessageChannel;
	attachments?: MessageAttachment[];
	visitorId?: string;
	contactId?: string;
}

export interface SentMessage {
	id: string;
	text: string;
	from: MessageSender;
	conversationId: string;
	createdAt: string;
	html?: string | null;
	sources?: unknown[] | null;
	usage?: unknown | null;
	externalId?: string | null;
	userId?: string | null;
}

export interface SendMessageResponse {
	success: boolean;
	message: SentMessage;
}
