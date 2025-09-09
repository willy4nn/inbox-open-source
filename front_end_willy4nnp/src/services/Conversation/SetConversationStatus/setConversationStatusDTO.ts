interface SetStatusRequestDTO {
	status: "RESOLVED" | "UNRESOLVED" | "HUMAN_REQUESTED";
}

interface SetStatusResponseDTO {
	success: boolean;
	message: string;
}

export type { SetStatusRequestDTO, SetStatusResponseDTO };
