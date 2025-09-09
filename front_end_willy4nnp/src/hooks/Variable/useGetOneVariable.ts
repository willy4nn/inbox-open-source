import useSWR from "swr";
import { getOneVariable } from "@/services/Variable/GetOneVariable/getOneVariable";
import type {
	GetOneVariableRequestDTO,
	GetOneVariableResponseDTO,
} from "@/services/Variable/GetOneVariable/getOneVariableDTO";

// SWR hook to fetch a single variable from a conversation
export function useGetOneVariable(params: GetOneVariableRequestDTO) {
	const { data, error, isLoading, mutate } =
		useSWR<GetOneVariableResponseDTO>(
			["variable", params.conversationId, params.varName],
			() => getOneVariable(params.conversationId, params.varName)
		);

	return {
		variable: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
