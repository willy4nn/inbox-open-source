interface SetAiEnabledRequestDTO {
	enabled: boolean;
}

interface SetAiEnabledResponseDTO {
	success: boolean;
	message: string;
}

export type { SetAiEnabledRequestDTO, SetAiEnabledResponseDTO };
