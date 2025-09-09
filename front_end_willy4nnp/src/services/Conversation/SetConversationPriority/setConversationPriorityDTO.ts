interface SetPriorityRequestDTO {
	priority: "LOW" | "MEDIUM" | "HIGH";
}

interface SetPriorityResponseDTO {
	success: boolean;
	message: string;
}

export type { SetPriorityRequestDTO, SetPriorityResponseDTO };
