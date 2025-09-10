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
		<Sidebar>
			{/* HEADER */}
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-4 border">
					<span className="font-bold text-lg">Inbox</span>
				</div>
			</SidebarHeader>

			{/* CONTENT */}
			<SidebarContent>
				{/* Lista de inboxes */}
				<SidebarGroup>
					<SidebarGroupLabel>Inboxes</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{organizations.map((org) => (
								<SidebarMenuItem key={org.token}>
									<SidebarMenuButton asChild>
										<div
											className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer hover:bg-accent ${
												activeOrg?.token === org.token
													? "bg-accent/50 font-semibold"
													: ""
											}`}
											onClick={() =>
												setActiveOrg(org.token)
											}
										>
											<div className="flex flex-col">
												<span>{org.inboxName}</span>
												<span className="text-xs text-muted-foreground">
													{org.agents.length} agentes
												</span>
											</div>
											<button
												className="p-1 rounded hover:bg-red-500 hover:text-white"
												onClick={(e) => {
													e.stopPropagation();
													removeOrganization(
														org.token
													);
												}}
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}

							{/* Botão para adicionar inbox */}
							<SidebarMenuItem>
								<AddOrganizationDialog />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Menu fixo da aplicação */}
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a
										href="#"
										className="flex items-center gap-2"
									>
										<Home className="w-4 h-4" />
										<span>Dashboard</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* FOOTER */}
			<SidebarFooter>
				<div className="px-4 py-2 text-xs text-muted-foreground">
					© 2025 Inbox - v1.0.0
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
