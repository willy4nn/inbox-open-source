// useGetAllConversations.ts
import useSWR from "swr";
import { getAllConversations } from "@/services/Conversation/GetAllConversations/getAllConversations";
import type {
	getAllConversationsRequestDTO,
	getAllConversationsResponseDTO,
} from "@/services/Conversation/GetAllConversations/getAllConversationsDTO";

// SWR fetcher
const fetcher = (params?: getAllConversationsRequestDTO) =>
	getAllConversations(params);

export function useGetAllConversations(params?: getAllConversationsRequestDTO) {
	const { data, error, isLoading, mutate } =
		useSWR<getAllConversationsResponseDTO>(["conversations", params], () =>
			fetcher(params)
		);

	return {
		conversations: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
