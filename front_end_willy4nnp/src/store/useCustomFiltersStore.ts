import { create } from "zustand";

interface CustomFilter {
	id: string;
	name: string;

	// 🔑 Opções de filtro alinhadas ao DTO de conversa
	responsavel?: string; // assignee.id
	canal?: string; // channel
	agenteIA?: string; // agentId
	prioridade?: "LOW" | "MEDIUM" | "HIGH"; // priority
	etiquetas?: string[]; // conversationVariables (varName === "tag")
	statusIA?: "ENABLED" | "DISABLED"; // isAiEnabled
	cenarioCRM?: string; // crmScenarioConversations (texto ou id do cenário)
	nivelInsatisfacao?: number; // frustration
}

interface CustomFiltersState {
	filters: CustomFilter[];
	selectedFilter: string | null;
	addFilter: (filter: CustomFilter) => void;
	removeFilter: (id: string) => void;
	selectFilter: (id: string | null) => void;
}

export const useCustomFiltersStore = create<CustomFiltersState>((set) => ({
	filters: [],
	selectedFilter: null,

	addFilter: (filter) =>
		set((state) => ({
			filters: [...state.filters, filter],
		})),

	removeFilter: (id) =>
		set((state) => ({
			filters: state.filters.filter((f) => f.id !== id),
			selectedFilter:
				state.selectedFilter === id ? null : state.selectedFilter,
		})),

	selectFilter: (id) => set({ selectedFilter: id }),
}));

export type { CustomFilter };
