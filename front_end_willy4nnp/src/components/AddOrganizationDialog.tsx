"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrgStore } from "@/store/useOrgStore";

export function AddOrganizationDialog() {
	const addOrganization = useOrgStore((s) => s.addOrganization);

	const [token, setToken] = useState("");
	const [inboxName, setInboxName] = useState("");
	const [agents, setAgents] = useState("");
	const [error, setError] = useState<string>("");

	const handleSubmit = () => {
		if (!token || !inboxName) {
			setError("Token e nome do inbox são obrigatórios.");
			return;
		}

		const success = addOrganization({
			token,
			inboxName,
			agents: agents
				.split(",")
				.map((a) => a.trim())
				.filter(Boolean),
		});

		if (!success) {
			setError("Já existe um inbox com esse token!");
			return;
		}

		// limpa campos e erro
		setToken("");
		setInboxName("");
		setAgents("");
		setError("");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="cursor-pointer w-full bg-[var(--background-500)] border-[var(--background-600)] hover:bg-[var(--background-600)] hover:border-[var(--background-700)]"
				>
					Adicionar Inbox
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novo Inbox</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div>
						<Label>Token da Organização</Label>
						<Input
							value={token}
							onChange={(e) => setToken(e.target.value)}
							placeholder="token-123"
						/>
					</div>

					<div>
						<Label>Nome do Inbox</Label>
						<Input
							value={inboxName}
							onChange={(e) => setInboxName(e.target.value)}
							placeholder="Meu Inbox"
						/>
					</div>

					<div>
						<Label>Agentes de IA (IDs separados por vírgula)</Label>
						<Input
							value={agents}
							onChange={(e) => setAgents(e.target.value)}
							placeholder="agente-1, agente-2"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={handleSubmit} className="w-full">
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
