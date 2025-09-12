// src/components/layout/SidebarInbox.tsx
import { CustomSidebarTrigger } from "./CustomSidebarTrigger";

export function SidebarInbox() {
	return (
		<div className="px-4 py-3 bg-[var(--background-300)] border-[var(--background-400)] border-b">
			<CustomSidebarTrigger />
		</div>
	);
}
