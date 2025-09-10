"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function CustomSidebarTrigger() {
	const { toggleSidebar } = useSidebar();

	return (
		<button
			onClick={toggleSidebar}
			className="cursor-pointer p-2 rounded border border-gray-300"
		>
			<Menu className="w-4 h-4 text-gray-700" />
		</button>
	);
}
