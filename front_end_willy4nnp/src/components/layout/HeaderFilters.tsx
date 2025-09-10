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

export function HeaderFilters() {
	const searchQuery = useConversationsStore((s) => s.searchQuery);
	const statusFilter = useConversationsStore((s) => s.statusFilter);
	const setSearchQuery = useConversationsStore((s) => s.setSearchQuery);
	const setStatusFilter = useConversationsStore((s) => s.setStatusFilter);

	const { filters, selectedFilter, selectFilter } = useCustomFiltersStore();

	const [showCustomFilters, setShowCustomFilters] = useState(false);

	return (
		<header className="w-full p-4 border-b border-gray-200 flex items-center justify-between gap-4">
			{/* Campo de busca */}
			<Input
				type="text"
				placeholder="Buscar conversas ou mensagens..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="flex-1"
			/>

			{/* Filtros rápidos e avançados */}
			<div className="flex gap-2 items-center">
				{/* Filtros rápidos */}
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

				{/* Botão para abrir modal de filtros avançados */}
				<Button
					variant="outline"
					onClick={() => setShowCustomFilters(true)}
				>
					Filtros Avançados
				</Button>

				{/* Select com filtros salvos */}
				<Select
					value={selectedFilter ?? ""}
					onValueChange={(val) => selectFilter(val || null)}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Selecionar filtro salvo" />
					</SelectTrigger>
					<SelectContent>
						{filters.map((f) => (
							<SelectItem key={f.id} value={f.id}>
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
