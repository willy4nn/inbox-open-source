"use client";

import { useEffect, useRef, useState } from "react";
import { useConversationsStore } from "@/store/useConversationsStore";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useRegisterMessage } from "@/hooks/Message/useRegisterMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatContainer() {
	const selectedConversation = useConversationsStore(
		(s) => s.selectedConversation
	);

	const { messagesByConversation, setMessages } = useMessagesStore();
	const { registerMessage, isMutating } = useRegisterMessage();

	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	// Pega as mensagens da conversa selecionada
	const messages = selectedConversation
		? messagesByConversation[selectedConversation.id] || []
		: [];

	// Scroll automático sempre que mudar conversa ou mensagens
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, selectedConversation]);

	if (!selectedConversation)
		return <p className="p-4">Selecione uma conversa para abrir o chat</p>;

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !selectedConversation) return;

		// Envia mensagem pela API
		const sent = await registerMessage({
			conversationId: selectedConversation.id,
			payload: { message: newMessage, from: "agent" },
		});

		// Atualiza store local imediatamente (optimistic update)
		if (sent) {
			setMessages(selectedConversation.id, [
				...messages,
				{
					id: crypto.randomUUID(),
					conversationId: selectedConversation.id,
					sender: "agent",
					text: newMessage,
					timestamp: new Date().toISOString(),
				},
			]);
		}

		setNewMessage("");
	};

	// Ordena mensagens por timestamp
	const sortedMessages = messages
		?.slice()
		.sort(
			(a, b) =>
				new Date(a.timestamp).getTime() -
				new Date(b.timestamp).getTime()
		);

	return (
		<div className="flex-1 flex flex-col">
			{/* Header da conversa */}
			<div className="p-4 border-b">
				<h2 className="text-lg font-semibold">
					{selectedConversation.aiUserIdentifier ??
						selectedConversation.title ??
						"Sem título"}
				</h2>
			</div>

			{/* Área das mensagens */}
			<div className="flex-1 p-4 overflow-y-auto space-y-4">
				{sortedMessages?.map((msg) => (
					<ChatMessage
						key={msg.id}
						text={msg.text}
						sender={msg.sender === "human" ? "human" : "agent"}
						timestamp={msg.timestamp}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Input para enviar mensagem */}
			<ChatInput
				value={newMessage}
				onChange={setNewMessage}
				onSend={handleSendMessage}
				disabled={isMutating}
			/>
		</div>
	);
}
