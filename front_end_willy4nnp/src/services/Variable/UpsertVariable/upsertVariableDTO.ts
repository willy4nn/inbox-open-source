interface UpsertVariableRequestDTO {
	conversationId: string;
	varName: string;
	varValue: string;
}

interface UpsertVariableResponseDTO {
	conversationId: string;
	varName: string;
	varValue: string;
}

export type { UpsertVariableRequestDTO, UpsertVariableResponseDTO };
