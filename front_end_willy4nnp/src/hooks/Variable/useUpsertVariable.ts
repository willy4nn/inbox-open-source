import useSWRMutation from "swr/mutation";
import { upsertVariable } from "@/services/Variable/UpsertVariable/upsertVariable";
import type {
	UpsertVariableRequestDTO,
	UpsertVariableResponseDTO,
} from "@/services/Variable/UpsertVariable/upsertVariableDTO";

// SWR Mutation hook to create or update a conversation variable
export function useUpsertVariable() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		UpsertVariableResponseDTO,
		Error,
		string,
		UpsertVariableRequestDTO
	>("upsertVariable", async (_key, { arg }) => {
		return upsertVariable(arg);
	});

	return {
		upsertVariable: trigger,
		data,
		error,
		isMutating,
	};
}
