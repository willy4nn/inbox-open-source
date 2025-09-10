"use client";

import { useConversationsStore } from "@/store/useConversationsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeaderFilters() {
	const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } =
		useConversationsStore();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleFilterClick = (
		status: "ALL" | "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED"
	) => {
		setStatusFilter(status);
	};

	return (
		<header className="w-full p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
			<Input
				placeholder="Buscar conversas..."
				value={searchQuery}
				onChange={handleSearchChange}
				className="flex-1"
			/>
			<div className="flex gap-2 mt-2 md:mt-0">
				<Button
					variant={statusFilter === "ALL" ? "default" : "outline"}
					size="sm"
					onClick={() => handleFilterClick("ALL")}
				>
					Todas
				</Button>
				<Button
					variant={
						statusFilter === "RESOLVED" ? "default" : "outline"
					}
					size="sm"
					onClick={() => handleFilterClick("RESOLVED")}
				>
					Resolvidas
				</Button>
				<Button
					variant={
						statusFilter === "UNRESOLVED" ? "default" : "outline"
					}
					size="sm"
					onClick={() => handleFilterClick("UNRESOLVED")}
				>
					Não resolvidas
				</Button>
				<Button
					variant={
						statusFilter === "HUMAN_REQUESTED"
							? "default"
							: "outline"
					}
					size="sm"
					onClick={() => handleFilterClick("HUMAN_REQUESTED")}
				>
					Humano solicitado
				</Button>
			</div>
		</header>
	);
}
