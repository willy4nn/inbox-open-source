// Conversation related types
export type ConversationStatus = "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
export type ConversationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface ConversationAssignee {
	id?: string;
	email?: string;
}

export interface ConversationVariable {
	conversationId: string;
	varName: string;
	varValue: string;
}

export interface ConversationContext {
	context: string;
	updatedAt: string;
}

export interface ParticipantContact {
	firstName: string;
}

export interface Conversation {
	id: string;
	title: string | null;
	assignees: ConversationAssignee[];
	isAiEnabled?: boolean;
	channel?: string;
	status?: ConversationStatus;
	metadata?: Record<string, unknown> | null;
	channelExternalId?: string;
	channelCredentialsId?: string | null;
	organizationId?: string;
	mailInboxId?: string | null;
	priority?: ConversationPriority;
	formId?: string | null;
	agentId?: string | null;
	userId?: string | null;
	visitorId?: string | null;
	frustration?: number;
	createdAt?: string;
	updatedAt?: string;
	participantsContacts?: ParticipantContact[];
	conversationVariables?: ConversationVariable[];
	conversationContexts?: ConversationContext[];
	isGroup?: boolean;
	aiUserIdentifier?: string | null;
	unreadMessagesCount?: number;
	crmScenarioConversations?: unknown[];
}
        