import { useEffect } from "react";
import { useMessagesStore } from "@/store/useMessagesStore";
import { getMessages } from "@/services/Message/GetMessages/getMessages";

export function useLoadAllMessages(
	allConversations: { id: string }[],
	concurrency = 3
) {
	const { setMessages } = useMessagesStore();

	useEffect(() => {
		if (!allConversations || allConversations.length === 0) return;

		let index = 0;

		async function worker() {
			while (index < allConversations.length) {
				const conv = allConversations[index];
				index++;
				try {
					const messages = await getMessages(conv.id, "1000");
					setMessages(conv.id, messages);
				} catch (err) {
					console.error(
						"Erro ao carregar mensagens da conversa",
						conv.id,
						err
					);
				}
			}
		}

		// Cria 'concurrency' workers paralelos
		const workers = Array.from({ length: concurrency }, () => worker());
		Promise.all(workers);
	}, [allConversations, concurrency, setMessages]);
}
