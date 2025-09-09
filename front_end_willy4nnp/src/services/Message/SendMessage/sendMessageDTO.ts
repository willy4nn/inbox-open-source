interface SendMessageRequestDTO {
	message: string;
	agentId?: string;
	channel?:
		| "website"
		| "dashboard"
		| "whatsapp"
		| "zapi"
		| "telegram"
		| "instagramDm";
	attachments?: {
		url: string;
		name: string;
		mimeType: string;
	}[];
	visitorId?: string;
	contactId?: string;
}

interface SendMessageResponseDTO {
	success: boolean;
	message: {
		id: string;
		text: string;
		from: "human" | "agent";
		conversationId: string;
		createdAt: string;
		html?: string | null;
		sources?: unknown[] | null;
		usage?: unknown | null;
		externalId?: string | null;
		userId?: string | null;
	};
}

export type { SendMessageRequestDTO, SendMessageResponseDTO };
