import useSWRMutation from "swr/mutation";
import { setConversationStatus } from "@/services/Conversation/SetConversationStatus/setConversationStatus";
import type {
	SetStatusRequestDTO,
	SetStatusResponseDTO,
} from "@/services/Conversation/SetConversationStatus/setConversationStatusDTO";

/**
 * SWR Mutation hook to set conversation status
 */
export function useSetConversationStatus() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		SetStatusResponseDTO, // response type
		Error, // error type
		string, // key type
		{ conversationId: string; payload: SetStatusRequestDTO } // arg type
	>("setConversationStatus", async (_key, { arg }) =>
		setConversationStatus(arg.conversationId, arg.payload)
	);

	return {
		setStatus: trigger, // call this to execute the mutation
		data,
		error,
		isMutating,
	};
}
