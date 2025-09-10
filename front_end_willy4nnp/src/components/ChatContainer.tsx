"use client";

import { useState, useEffect, useRef } from "react";
import { useConversationsStore } from "@/store/useConversationsStore";
import { useGetMessages } from "@/hooks/Message/useGetMessages";
import { useRegisterMessage } from "@/hooks/Message/useRegisterMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatContainer() {
	const selectedConversation = useConversationsStore(
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
	}, [messages, selectedConversation]);

	if (!selectedConversation)
		return <p>Selecione uma conversa para abrir o chat</p>;
	if (isLoading) return <p>Carregando mensagens...</p>;
	if (isError) return <p>Erro ao carregar mensagens.</p>;

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		await registerMessage({
			conversationId: selectedConversation.id,
			payload: { message: newMessage, from: "agent" },
		});

		setNewMessage("");
		mutateMessages();
	};

	const sortedMessages = messages?.slice().sort((a, b) => {
		return (
			new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
		);
	});

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
