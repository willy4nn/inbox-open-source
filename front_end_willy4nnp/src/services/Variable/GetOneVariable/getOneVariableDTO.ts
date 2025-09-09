interface GetOneVariableRequestDTO {
	conversationId: string;
	varName: string;
}

interface GetOneVariableResponseDTO {
	conversationId: string;
	varName: string;
	varValue: string;
}

export type { GetOneVariableRequestDTO, GetOneVariableResponseDTO };
