"use client";

import { useGetMemberships } from "@/hooks/Memberships/useGetMemberships";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/provider/ThemeProvider"; // hook que criamos no ThemeProvider
import { Sun, Moon } from "lucide-react";

export function SidebarInbox() {
	const { memberships, isLoading } = useGetMemberships();
	const { theme, toggleTheme, inboxName, logoUrl } = useTheme();

	if (isLoading) {
		return (
			<div className="px-4 py-3 bg-[var(--background-300)] border-[var(--background-400)] border-b flex justify-between items-center">
				<div className="text-white font-semibold">{inboxName}</div>
				<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
			</div>
		);
	}

	// Pega o OWNER
	const owner = memberships?.find((m) => m.role === "OWNER");

	const avatarUrl =
		owner?.customPicture || owner?.picture || owner?.image || undefined;

	return (
		<div className="px-4 py-3 bg-[var(--background-300)] border-[var(--background-400)] border-b flex justify-between items-center">
			{/* Logo + Nome do Inbox / White-label */}
			<div className="flex items-center gap-2">
				{logoUrl && (
					<img
						src={logoUrl}
						alt={inboxName}
						className="w-8 h-8 object-contain"
					/>
				)}
				<div className="text-[var(--foreground-50)] text-xl font-semibold">
					{inboxName}
				</div>
			</div>

			{/* Avatar e botão de tema */}
			<div className="flex items-center gap-2">
				{/* Botão de trocar tema */}
				<button
					onClick={toggleTheme}
					className="p-1 cursor-pointer rounded hover:bg-[var(--background-400)] transition-colors"
					aria-label="Toggle Theme"
				>
					{theme === "light" ? (
						<Moon className="w-8 h-8 text-[var(--foreground-50)]" />
					) : (
						<Sun className="w-8 h-8 text-[var(--foreground-50)]" />
					)}
				</button>

				{/* Avatar do usuário */}
				<Avatar className="w-8 h-8 border-2 border-black cursor-pointer">
					{avatarUrl ? (
						<AvatarImage
							src={avatarUrl}
							alt={owner?.name ?? "Usuário"}
						/>
					) : (
						<AvatarFallback>
							{owner?.name?.[0]?.toUpperCase() ?? "?"}
						</AvatarFallback>
					)}
				</Avatar>
			</div>
		</div>
	);
}
