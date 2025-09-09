import useSWRMutation from "swr/mutation";
import { deleteVariable } from "@/services/Variable/DeleteVariable/deleteVariable";
import type {
	DeleteVariableRequestDTO,
	DeleteVariableResponseDTO,
} from "@/services/Variable/DeleteVariable/deleteVariableDTO";

// Hook to delete a conversation variable using SWR Mutation
export function useDeleteVariable() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		DeleteVariableResponseDTO,
		Error,
		string,
		DeleteVariableRequestDTO
	>("deleteVariable", async (_key, { arg }) => {
		return deleteVariable(arg);
	});

	return {
		deleteVariable: trigger,
		data,
		error,
		isMutating,
	};
}
