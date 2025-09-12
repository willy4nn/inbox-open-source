// membershipsDTO.ts

export interface getMembershipsResponseItem {
	email: string;
	name: string;
	image: string | null;
	picture: string | null;
	customPicture: string | null;
	role: string | null; // role do membership (OWNER, USER, etc.)
}

export type getMembershipsResponseDTO = getMembershipsResponseItem[];
