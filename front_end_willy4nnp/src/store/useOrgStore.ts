// src/store/useOrgStore.ts
import { create } from "zustand";

export type Organization = {
	id: string;
	name: string;
	agents: string[];
};

type OrgStore = {
	organizations: Organization[];
	activeOrg: Organization | null;
	addOrganization: (org: Organization) => void;
	setActiveOrg: (id: string) => void;
};

export const useOrgStore = create<OrgStore>((set, get) => ({
	organizations: [],
	activeOrg: null,
	addOrganization: (org) =>
		set((state) => ({
			organizations: [...state.organizations, org],
			activeOrg: org, // já ativa a nova org
		})),
	setActiveOrg: (id) =>
		set(() => ({
			activeOrg: get().organizations.find((o) => o.id === id) || null,
		})),
}));
