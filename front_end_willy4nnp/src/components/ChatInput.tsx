"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	disabled?: boolean;
}

export const ChatInput = ({
	value,
	onChange,
	onSend,
	disabled,
}: ChatInputProps) => {
	return (
		<div className="p-4 border-t flex gap-2">
			<Input
				placeholder="Digite sua mensagem..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") onSend();
				}}
				disabled={disabled}
			/>
			<Button onClick={onSend} disabled={disabled}>
				Enviar
			</Button>
		</div>
	);
};
