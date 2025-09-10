import { create } from "zustand";
import type { GetMessagesResponseDTO } from "@/services/Message/GetMessages/getMessagesDTO";

interface MessagesState {
	messagesByConversation: Record<string, GetMessagesResponseDTO>;
	setMessages: (
		conversationId: string,
		messages: GetMessagesResponseDTO
	) => void;
	clearMessages: () => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
	messagesByConversation: {},
	setMessages: (conversationId, messages) =>
		set((state) => ({
			messagesByConversation: {
				...state.messagesByConversation,
				[conversationId]: messages,
			},
		})),
	clearMessages: () => set({ messagesByConversation: {} }),
}));
