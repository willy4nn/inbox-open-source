// getMemberships.ts
import type { getMembershipsResponseDTO } from "@/services/Memberships/GetMemberships/getMembershipsDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMemberships(): Promise<getMembershipsResponseDTO> {
	const res = await fetch(`${BASE_URL}/api/memberships`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch memberships: ${res.statusText}`);
	}

	return res.json();
}
