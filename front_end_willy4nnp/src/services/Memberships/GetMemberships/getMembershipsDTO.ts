// membershipsDTO.ts
export interface getMembershipsResponseItem {
	email: string;
	name: string;
	image: string | null;
	picture: string | null;
	customPicture: string | null;
}

export type getMembershipsResponseDTO = getMembershipsResponseItem[];
