"use client";

import { Home, Trash2 } from "lucide-react";
import {
	Sidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AddOrganizationDialog } from "@/components/AddOrganizationDialog";
import { useOrgStore } from "@/store/useOrgStore";

export function AppSidebar() {
	const organizations = useOrgStore((s) => s.organizations);
	const activeOrg = useOrgStore((s) => s.activeOrg);
	const setActiveOrg = useOrgStore((s) => s.setActiveOrg);
	const removeOrganization = useOrgStore((s) => s.removeOrganization);

	return (
		<Sidebar className="border-[var(--background-500)] h-screen">
			{/* HEADER */}
			<SidebarHeader className="bg-[var(--background-400)] items-center p-3">
				<div className="flex items-center gap-2 px-0 py-0">
					<span className="font-bold text-2xl">Inbox</span>
				</div>
			</SidebarHeader>

			{/* CONTENT */}
			<SidebarContent className="bg-[var(--background-400)] px-2 py-2">
				{/* Lista de inboxes */}
				<SidebarGroup>
					<SidebarGroupLabel>Inboxes</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
	

							{/* Botão para adicionar inbox */}
							<SidebarMenuItem>
								<AddOrganizationDialog />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>


			</SidebarContent>

			{/* FOOTER */}
			<SidebarFooter className="bg-[var(--background-400)] px-2 py-2">
				<div className="px-4 py-2 text-xs text-[var(--foreground-50)]">
					© 2025 Inbox - v1.0.0
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
