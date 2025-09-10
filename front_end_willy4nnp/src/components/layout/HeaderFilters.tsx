// src/components/layout/HeaderFilters.tsx
"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeaderFilters() {
	const searchQuery = useConversationsStore((s) => s.searchQuery);
	const statusFilter = useConversationsStore((s) => s.statusFilter);
	const setSearchQuery = useConversationsStore((s) => s.setSearchQuery);
	const setStatusFilter = useConversationsStore((s) => s.setStatusFilter);

	return (
		<header className="w-full p-4 border-b border-gray-200 flex items-center justify-between gap-4">
			{/* Campo de busca */}
			<Input
				type="text"
				placeholder="Buscar conversas..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="flex-1"
			/>

			{/* Botões de filtro de status */}
			<div className="flex gap-2">
				<Button
					variant={statusFilter === "ALL" ? "default" : "outline"}
					onClick={() => setStatusFilter("ALL")}
				>
					Todas
				</Button>
				<Button
					variant={
						statusFilter === "RESOLVED" ? "default" : "outline"
					}
					onClick={() => setStatusFilter("RESOLVED")}
				>
					Resolvidas
				</Button>
				<Button
					variant={
						statusFilter === "UNRESOLVED" ? "default" : "outline"
					}
					onClick={() => setStatusFilter("UNRESOLVED")}
				>
					Não Resolvidas
				</Button>
				<Button
					variant={
						statusFilter === "HUMAN_REQUESTED"
							? "default"
							: "outline"
					}
					onClick={() => setStatusFilter("HUMAN_REQUESTED")}
				>
					Humano solicitado
				</Button>
				<Button
					variant={statusFilter === "UNREAD" ? "default" : "outline"}
					onClick={() => setStatusFilter("UNREAD")}
				>
					Não Lidas
				</Button>
			</div>
		</header>
	);
}
