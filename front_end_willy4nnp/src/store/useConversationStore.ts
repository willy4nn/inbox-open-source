// src/store/useConversationStore.ts
import { create } from "zustand";

export interface Conversation {
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

type ConversationStore = {
	selectedConversation: Conversation | null;
	setSelectedConversation: (conv: Conversation) => void;
	clearSelectedConversation: () => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
	selectedConversation: null,
	setSelectedConversation: (conv) => set({ selectedConversation: conv }),
	clearSelectedConversation: () => set({ selectedConversation: null }),
}));
