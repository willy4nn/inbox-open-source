import useSWR from "swr";
import { getConversationById } from "@/services/Conversation/GetConversationById/getConversationById";
import type {
	getConversationByIdRequestDTO,
	getConversationByIdResponseDTO,
} from "@/services/Conversation/GetConversationById/getConversationByIdDTO";

export function useGetConversationById(params: getConversationByIdRequestDTO) {
	const { data, error, isLoading, mutate } =
		useSWR<getConversationByIdResponseDTO>(
			["conversation", params.conversationId],
			() => getConversationById(params)
		);

	return {
		conversation: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
