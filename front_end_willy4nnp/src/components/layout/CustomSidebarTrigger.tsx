"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function CustomSidebarTrigger() {
	const { toggleSidebar } = useSidebar();

	return (
		<button
			onClick={toggleSidebar}
			className="cursor-pointer p-2 rounded border bg-[var(--background-400)] border-[var(--background-500)]"
		>
			<Menu className="w-4 h-4 text-gray-700" />
		</button>
	);
}
