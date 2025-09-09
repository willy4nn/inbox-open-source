import useSWRMutation from "swr/mutation";
import { sendMessage } from "@/services/Message/SendMessage/sendMessage";
import type {
	SendMessageRequestDTO,
	SendMessageResponseDTO,
} from "@/services/Message/SendMessage/sendMessageDTO";

/**
 * SWR Mutation hook to send a message
 */
export function useSendMessage() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		SendMessageResponseDTO, // response type
		Error, // error type
		string, // key type
		{
			type: "conversationId" | "phone" | "email";
			value: string;
			payload: SendMessageRequestDTO;
		} // arg type
	>(
		"sendMessage", // cache key
		async (_key, { arg }) => sendMessage(arg.type, arg.value, arg.payload)
	);

	return {
		sendMessage: trigger, // call this to execute the mutation
		data,
		error,
		isMutating,
	};
}
