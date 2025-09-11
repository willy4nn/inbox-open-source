"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	useCustomFiltersStore,
	CustomFilter,
} from "@/store/useCustomFiltersStore";
import { useGetMemberships } from "@/hooks/Memberships/useGetMemberships";

interface CustomFiltersModalProps {
	open: boolean;
	onClose: () => void;
}

export function CustomFiltersModal({ open, onClose }: CustomFiltersModalProps) {
	const addFilter = useCustomFiltersStore((state) => state.addFilter);

	const [name, setName] = useState("");
	const [responsavel, setResponsavel] = useState(""); // email do usuário
	const [canal, setCanal] = useState("");
	const [agenteIA, setAgenteIA] = useState("");
	const [prioridade, setPrioridade] = useState<
		"LOW" | "MEDIUM" | "HIGH" | ""
	>("");
	const [etiquetas, setEtiquetas] = useState("");
	const [statusIA, setStatusIA] = useState<"ENABLED" | "DISABLED" | "">("");
	const [cenarioCRM, setCenarioCRM] = useState("");
	const [nivelInsatisfacao, setNivelInsatisfacao] = useState<number | "">("");

	const { memberships, isLoading } = useGetMemberships();

	const handleSave = () => {
		if (!name.trim()) return;

		const newFilter: CustomFilter = {
			id: crypto.randomUUID(),
			name,
			responsavel: responsavel || undefined,
			canal: canal || undefined,
			agenteIA: agenteIA || undefined,
			prioridade: prioridade || undefined,
			etiquetas: etiquetas
				? etiquetas.split(",").map((e) => e.trim())
				: [],
			statusIA: statusIA || undefined,
			cenarioCRM: cenarioCRM || undefined,
			nivelInsatisfacao:
				nivelInsatisfacao === ""
					? undefined
					: Number(nivelInsatisfacao),
		};

		addFilter(newFilter);

		// reset campos
		setName("");
		setResponsavel("");
		setCanal("");
		setAgenteIA("");
		setPrioridade("");
		setEtiquetas("");
		setStatusIA("");
		setCenarioCRM("");
		setNivelInsatisfacao("");

		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Criar Filtro Personalizado</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label>Nome do filtro</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div>
						<Label>Usuário responsável</Label>
						<Select
							value={responsavel}
							onValueChange={setResponsavel}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={
										isLoading
											? "Carregando..."
											: "Selecione um usuário"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{memberships?.map((m) => (
									<SelectItem key={m.email} value={m.email}>
										{m.name} ({m.email})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Canal</Label>
						<Input
							value={canal}
							onChange={(e) => setCanal(e.target.value)}
						/>
					</div>

					<div>
						<Label>Agente de IA</Label>
						<Input
							value={agenteIA}
							onChange={(e) => setAgenteIA(e.target.value)}
						/>
					</div>

					<div>
						<Label>Prioridade</Label>
						<Input
							value={prioridade}
							onChange={(e) =>
								setPrioridade(
									["LOW", "MEDIUM", "HIGH"].includes(
										e.target.value
									)
										? (e.target.value as any)
										: ""
								)
							}
						/>
					</div>

					<div>
						<Label>Etiquetas (separadas por vírgula)</Label>
						<Input
							value={etiquetas}
							onChange={(e) => setEtiquetas(e.target.value)}
						/>
					</div>

					<div>
						<Label>Status da IA na conversa</Label>
						<Input
							value={statusIA}
							onChange={(e) =>
								["ENABLED", "DISABLED"].includes(e.target.value)
									? setStatusIA(e.target.value as any)
									: setStatusIA("")
							}
						/>
					</div>

					<div>
						<Label>Cenário CRM</Label>
						<Input
							value={cenarioCRM}
							onChange={(e) => setCenarioCRM(e.target.value)}
						/>
					</div>

					<div>
						<Label>Nível de Insatisfação</Label>
						<Input
							type="number"
							value={nivelInsatisfacao}
							onChange={(e) =>
								setNivelInsatisfacao(
									e.target.value === ""
										? ""
										: Number(e.target.value)
								)
							}
						/>
					</div>
				</div>

				<DialogFooter className="mt-6">
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button onClick={handleSave}>Salvar filtro</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
