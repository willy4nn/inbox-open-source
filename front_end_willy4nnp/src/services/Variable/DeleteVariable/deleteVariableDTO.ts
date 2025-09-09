interface DeleteVariableRequestDTO {
	conversationId: string;
	varName: string;
}

interface DeleteVariableResponseDTO {
	message: string;
	deleted: {
		conversationId: string;
		varName: string;
		varValue: string;
	};
}

export type { DeleteVariableRequestDTO, DeleteVariableResponseDTO };
