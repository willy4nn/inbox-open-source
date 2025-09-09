import useSWRMutation from "swr/mutation";
import { registerMessage } from "@/services/Message/RegisterMessage/registerMessage";
import type {
	RegisterMessageRequestDTO,
	RegisterMessageResponseDTO,
} from "@/services/Message/RegisterMessage/registerMessageDTO";

/**
 * SWR Mutation hook for registering a message
 */
export function useRegisterMessage() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		RegisterMessageResponseDTO, // response type
		Error, // error type
		string, // key type
		{ conversationId: string; payload: RegisterMessageRequestDTO } // arg type
	>(
		"registerMessage", // cache key
		async (_key, { arg }) =>
			registerMessage(arg.conversationId, arg.payload)
	);

	return {
		registerMessage: trigger, // call this to execute mutation
		data,
		error,
		isMutating,
	};
}
