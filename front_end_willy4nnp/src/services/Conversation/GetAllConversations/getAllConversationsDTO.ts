interface getAllConversationsRequestDTO {
	agentId?: string;
	createdAt?: string; // YYYY-MM-DD
	status?: "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
}

interface getAllConversationsResponseItem {
	id: string;
	title: string | null;
	assignees: {
		id?: string;
		email?: string;
	}[];
	isAiEnabled?: boolean;
	channel?: string;
	status?: "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
	metadata?: Record<string, unknown> | null;
	channelExternalId?: string;
	channelCredentialsId?: string | null;
	organizationId?: string;
	mailInboxId?: string | null;
	priority?: "LOW" | "MEDIUM" | "HIGH";
	formId?: string | null;
	agentId?: string | null;
	userId?: string | null;
	visitorId?: string | null;
	frustration?: number;
	createdAt?: string;
	updatedAt?: string;
	participantsContacts?: {
		firstName: string;
	}[];
	conversationVariables?: {
		conversationId: string;
		varName: string;
		varValue: string;
	}[];
	conversationContexts?: {
		context: string;
		updatedAt: string;
	}[];
	isGroup?: boolean;
	aiUserIdentifier?: string | null;
	unreadMessagesCount?: number;
	crmScenarioConversations?: unknown[];
}

type getAllConversationsResponseDTO = getAllConversationsResponseItem[];

export type { getAllConversationsRequestDTO, getAllConversationsResponseDTO };
