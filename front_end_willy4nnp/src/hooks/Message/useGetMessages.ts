import useSWR from "swr";
import { getMessages } from "@/services/Message/GetMessages/getMessages";
import type { GetMessagesResponseDTO } from "@/services/Message/GetMessages/getMessagesDTO";

export function useGetMessages(conversationId: string | null, count: string) {
	const { data, error, isLoading, mutate } = useSWR<GetMessagesResponseDTO>(
		conversationId ? ["messages", conversationId, count] : null,
		() => getMessages(conversationId!, count)
	);

	return {
		messages: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
