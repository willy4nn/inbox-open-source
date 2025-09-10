// src/store/useConversationsStore.ts
import { create } from "zustand";
import type { getConversationByIdResponseDTO as Conversation } from "@/services/Conversation/GetConversationById/getConversationByIdDTO";

interface ConversationsState {
	allConversations: Conversation[];
	selectedConversation: Conversation | null;
	searchQuery: string;
	statusFilter:
		| "ALL"
		| "RESOLVED"
		| "UNRESOLVED"
		| "HUMAN_REQUESTED"
		| "UNREAD";

	// Actions
	setAllConversations: (convs: Conversation[]) => void;
	setSelectedConversation: (conv: Conversation) => void;
	clearSelectedConversation: () => void;
	setSearchQuery: (query: string) => void;
	setStatusFilter: (
		status: "ALL" | "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED" | "UNREAD"
	) => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
	allConversations: [],
	selectedConversation: null,
	searchQuery: "",
	statusFilter: "ALL",

	setAllConversations: (convs) => set({ allConversations: convs }),
	setSelectedConversation: (conv) => set({ selectedConversation: conv }),
	clearSelectedConversation: () => set({ selectedConversation: null }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setStatusFilter: (status) => set({ statusFilter: status }),
}));
