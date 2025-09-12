"use client";

import { useState } from "react";
import { useConversationsStore } from "@/store/useConversationsStore";
import { useCustomFiltersStore } from "@/store/useCustomFiltersStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CustomFiltersModal } from "@/components/CustomFiltersModal";
import { Filter } from "lucide-react";

export function HeaderFilters() {
	const searchQuery = useConversationsStore((s) => s.searchQuery);
	const statusFilter = useConversationsStore((s) => s.statusFilter);
	const setSearchQuery = useConversationsStore((s) => s.setSearchQuery);
	const setStatusFilter = useConversationsStore((s) => s.setStatusFilter);

	const { filters, selectedFilter, selectFilter } = useCustomFiltersStore();

	const [showCustomFilters, setShowCustomFilters] = useState(false);

	return (
		<header className="w-full py-3 p-4 border-b bg-[var(--background-200)] border-[var(--background-300)] flex items-center justify-between gap-4">
			{/* Campo de busca */}
			<Input
				type="text"
				placeholder="Buscar conversas ou mensagens..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="flex-1 bg-[var(--background-300)] border-[var(--background-400)] border"
			/>

			{/* Filtros rápidos e avançados */}
			<div className="flex gap-2 items-center">
				{/* Filtros rápidos */}
				<Button
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
					variant={statusFilter === "ALL" ? "default" : "outline"}
					onClick={() => setStatusFilter("ALL")}
				>
					Todas
				</Button>
				<Button
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
					variant={
						statusFilter === "RESOLVED" ? "default" : "outline"
					}
					onClick={() => setStatusFilter("RESOLVED")}
				>
					Resolvidas
				</Button>
				<Button
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
					variant={
						statusFilter === "UNRESOLVED" ? "default" : "outline"
					}
					onClick={() => setStatusFilter("UNRESOLVED")}
				>
					Não Resolvidas
				</Button>
				<Button
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
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
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
					variant={statusFilter === "UNREAD" ? "default" : "outline"}
					onClick={() => setStatusFilter("UNREAD")}
				>
					Não Lidas
				</Button>

				{/* Botão para abrir modal de filtros avançados */}
				<Button
					variant="outline"
					onClick={() => setShowCustomFilters(true)}
					className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
				>
					Filtros Avançados
				</Button>

				{/* Select com filtros salvos */}
				<Select
					value={selectedFilter ?? ""}
					onValueChange={(val) => selectFilter(val || null)}
				>
					<SelectTrigger className="w-fit text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)] flex items-center justify-between px-2">
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-[var(--foreground-50)]" />
							<SelectValue/>
						</div>
					</SelectTrigger>
					<SelectContent className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]">
						{filters.map((f) => (
							<SelectItem
								className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
								key={f.id}
								value={f.id}
							>
								{f.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Botão para limpar filtro selecionado */}
				{selectedFilter && (
					<Button
						variant="outline"
						onClick={() => selectFilter(null)}
						className="text-[var(--foreground-50)] cursor-pointer bg-[var(--background-300)] border border-[var(--background-400)] hover:bg-[var(--background-400)] hover:border-[var(--background-500)]"
					>
						Limpar Filtro
					</Button>
				)}
			</div>

			{/* Modal para criar filtros customizados */}
			<CustomFiltersModal
				open={showCustomFilters}
				onClose={() => setShowCustomFilters(false)}
			/>
		</header>
	);
}
