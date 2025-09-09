interface RegisterMessageRequestDTO {
	message: string;
	from: "human" | "agent";
}

interface RegisterMessageResponseDTO {
	success: boolean;
	message: {
		id: string;
		conversationId: string;
		text: string;
		from: "human" | "agent";
		createdAt: string;
	};
}

export type { RegisterMessageRequestDTO, RegisterMessageResponseDTO };
