"use client";

import { useState, useEffect, useRef } from "react";
import { useConversationStore } from "@/store/useConversationStore";
import { useGetMessages } from "@/hooks/Message/useGetMessages";
import { useRegisterMessage } from "@/hooks/Message/useRegisterMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function ChatContainer() {
	const selectedConversation = useConversationStore(
		(s) => s.selectedConversation
	);

	const {
		messages,
		isLoading,
		isError,
		mutate: mutateMessages,
	} = useGetMessages(
		selectedConversation ? selectedConversation.id : null,
		"1000"
	);

	const { registerMessage, isMutating } = useRegisterMessage();
	const [newMessage, setNewMessage] = useState("");

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!selectedConversation)
		return <p>Selecione uma conversa para abrir o chat</p>;
	if (isLoading) return <p>Carregando mensagens...</p>;
	if (isError) return <p>Erro ao carregar mensagens.</p>;

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		await registerMessage({
			conversationId: selectedConversation.id,
			payload: {
				message: newMessage,
				from: "agent",
			},
		});

		setNewMessage("");
		mutateMessages();
	};

	return (
		<div className="flex-1 flex flex-col">
			{/* Header */}
			<div className="p-4 border-b">
				<h2 className="text-lg font-semibold">
					{selectedConversation.aiUserIdentifier ?? "Sem título"}
				</h2>
			</div>

			{/* Messages */}
			<div className="flex-1 p-4 overflow-y-auto space-y-4">
				{" "}
				{/* ↑ gap aumentado */}
				{messages?.map((msg) => {
					const isHuman = msg.sender === "human";

					return (
						<div
							key={msg.id}
							className={`flex ${
								isHuman ? "justify-start" : "justify-end"
							}`}
						>
							<div
								className={`max-w-sm md:max-w-lg p-2 rounded-lg shadow-sm ${
									isHuman
										? "bg-gray-200 text-gray-900"
										: "bg-blue-500 text-white"
								}`}
							>
								<p className="text-sm">{msg.text}</p>
								<span className="block text-[10px] opacity-70 mt-1">
									{dayjs(msg.timestamp).fromNow()}
								</span>
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-4 border-t flex gap-2">
				<Input
					placeholder="Digite sua mensagem..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSendMessage();
					}}
					disabled={isMutating}
				/>
				<Button onClick={handleSendMessage} disabled={isMutating}>
					Enviar
				</Button>
			</div>
		</div>
	);
}
