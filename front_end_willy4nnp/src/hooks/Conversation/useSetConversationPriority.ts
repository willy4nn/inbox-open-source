import useSWRMutation from "swr/mutation";
import { setConversationPriority } from "@/services/Conversation/SetConversationPriority/setConversationPriority";
import type {
	SetPriorityRequestDTO,
	SetPriorityResponseDTO,
} from "@/services/Conversation/SetConversationPriority/setConversationPriorityDTO";

/**
 * SWR Mutation hook to set conversation priority
 */
export function useSetConversationPriority() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		SetPriorityResponseDTO, // response type
		Error, // error type
		string, // key type
		{ conversationId: string; payload: SetPriorityRequestDTO } // arg type
	>("setConversationPriority", async (_key, { arg }) =>
		setConversationPriority(arg.conversationId, arg.payload)
	);

	return {
		setPriority: trigger, // call this to execute the mutation
		data,
		error,
		isMutating,
	};
}
