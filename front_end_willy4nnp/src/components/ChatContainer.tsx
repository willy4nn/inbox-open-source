"use client";

import { useEffect, useRef, useState } from "react";
import { useConversationsStore } from "@/store/useConversationsStore";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useRegisterMessage } from "@/hooks/Message/useRegisterMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useGetMessages } from "@/hooks/Message/useGetMessages";

export function ChatContainer() {
	const selectedConversation = useConversationsStore(
		(s) => s.selectedConversation
	);
	const { messagesByConversation, setMessages } = useMessagesStore();
	const { registerMessage, isMutating } = useRegisterMessage();
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	// 1️⃣ Usando hook SWR para carregar mensagens
	const {
		messages: fetchedMessages,
		isLoading,
		mutate,
	} = useGetMessages(
		selectedConversation?.id ?? null,
		"50" // quantidade de mensagens que quer buscar
	);

	// 2️⃣ Sempre que o fetch retornar, atualiza o store
	useEffect(() => {
		if (selectedConversation && fetchedMessages) {
			setMessages(selectedConversation.id, fetchedMessages);
		}
	}, [fetchedMessages, selectedConversation, setMessages]);

	// 3️⃣ Mensagens do store
	const messages = selectedConversation
		? messagesByConversation[selectedConversation.id] || []
		: [];

	// 4️⃣ Scroll automático
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, selectedConversation]);

	if (!selectedConversation)
		return <p className="p-4">Selecione uma conversa para abrir o chat</p>;

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !selectedConversation) return;

		const optimisticMessage = {
			id: crypto.randomUUID(),
			conversationId: selectedConversation.id,
			sender: "agent",
			text: newMessage,
			timestamp: new Date().toISOString(),
		};

		// Atualiza store local e SWR (optimistic update)
		setMessages(selectedConversation.id, [...messages, optimisticMessage]);
		if (mutate) {
			mutate([...messages, optimisticMessage], false);
		}
		setNewMessage("");

		try {
			await registerMessage({
				conversationId: selectedConversation.id,
				payload: { message: optimisticMessage.text, from: "agent" },
			});
			// Revalida SWR para garantir consistência
			if (mutate) mutate();
		} catch (err) {
			console.error("Erro ao enviar mensagem:", err);
			// opcional: remover mensagem otimista
			setMessages(selectedConversation.id, messages);
			if (mutate) mutate();
		}
	};

	// 5️⃣ Ordena mensagens
	const sortedMessages = messages
		?.slice()
		.sort(
			(a, b) =>
				new Date(a.timestamp).getTime() -
				new Date(b.timestamp).getTime()
		);

	return (
		<div className="flex-1 flex flex-col">
			<div className="p-4 border-b">
				<h2 className="text-lg font-semibold">
					{selectedConversation.aiUserIdentifier ??
						selectedConversation.title ??
						"Sem título"}
				</h2>
			</div>

			<div className="flex-1 p-4 overflow-y-auto space-y-4">
				{isLoading && <p>Carregando mensagens...</p>}
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

			<ChatInput
				value={newMessage}
				onChange={setNewMessage}
				onSend={handleSendMessage}
				disabled={isMutating}
			/>
		</div>
	);
}
