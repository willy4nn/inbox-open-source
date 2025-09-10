// src/store/useOrgStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Organization = {
	token: string; // Token da organização
	inboxName: string; // Nome do inbox
	agents: string[]; // IDs dos agentes
};

type OrgStore = {
	organizations: Organization[];
	activeOrg: Organization | null;
	addOrganization: (org: Organization) => boolean; // retorna false se não adicionou
	setActiveOrg: (token: string) => void;
	removeOrganization: (token: string) => void;
};

export const useOrgStore = create<OrgStore>()(
	persist(
		(set, get) => ({
			organizations: [],
			activeOrg: null,

			addOrganization: (org: Organization): boolean => {
				const exists = get().organizations.some(
					(o) => o.token === org.token
				);
				if (exists) return false; // não adiciona se já existe

				set((state) => ({
					organizations: [...state.organizations, org],
					activeOrg: org,
				}));

				return true;
			},

			setActiveOrg: (token: string) =>
				set(() => ({
					activeOrg:
						get().organizations.find((o) => o.token === token) ||
						null,
				})),

			removeOrganization: (token: string) =>
				set((state) => {
					const filtered = state.organizations.filter(
						(o) => o.token !== token
					);
					const isActiveDeleted = state.activeOrg?.token === token;
					return {
						organizations: filtered,
						activeOrg: isActiveDeleted ? null : state.activeOrg,
					};
				}),
		}),
		{
			name: "org-storage", // chave no localStorage
		}
	)
);
