import useSWR from "swr";
import { getMessages } from "@/services/Message/GetMessages/getMessages";
import type { GetMessagesResponseDTO } from "@/services/Message/GetMessages/getMessagesDTO";

// SWR hook to fetch messages from a conversation
export function useGetMessages(conversationId: string, count: string) {
	const { data, error, isLoading, mutate } = useSWR<GetMessagesResponseDTO>(
		["messages", conversationId, count],
		() => getMessages(conversationId, count)
	);

	return {
		messages: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
