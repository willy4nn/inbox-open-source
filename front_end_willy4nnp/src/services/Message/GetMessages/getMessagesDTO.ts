interface GetMessagesRequestDTO {
	conversationId: string;
	count: string;
}

interface MessageDTO {
	id: string;
	conversationId: string;
	sender: string;
	text: string;
	timestamp: string;
}

type GetMessagesResponseDTO = MessageDTO[];

export type { GetMessagesRequestDTO, GetMessagesResponseDTO };
