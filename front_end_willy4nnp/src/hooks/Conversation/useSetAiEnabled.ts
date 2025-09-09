import useSWRMutation from "swr/mutation";
import { setAiEnabled } from "@/services/Conversation/SetAiEnabled/setAiEnabled";
import type {
	SetAiEnabledRequestDTO,
	SetAiEnabledResponseDTO,
} from "@/services/Conversation/SetAiEnabled/setAiEnabledDTO";

// SWR Mutation hook to enable/disable AI in a conversation
export function useSetAiEnabled() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		SetAiEnabledResponseDTO, // response type
		Error, // error type
		string, // key type
		{ conversationId: string; payload: SetAiEnabledRequestDTO } // arg type
	>("setAiEnabled", async (_key, { arg }) =>
		setAiEnabled(arg.conversationId, arg.payload)
	);

	return {
		setAiEnabled: trigger, // call this to execute
		data,
		error,
		isMutating,
	};
}
