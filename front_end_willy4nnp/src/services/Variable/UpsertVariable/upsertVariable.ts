import type {
	UpsertVariableRequestDTO,
	UpsertVariableResponseDTO,
} from "@/services/Variable/UpsertVariable/upsertVariableDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create or update a conversation variable
export async function upsertVariable(
	payload: UpsertVariableRequestDTO
): Promise<UpsertVariableResponseDTO> {
	const res = await fetch(`${BASE_URL}/variables`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		throw new Error(
			`Failed to upsert variable "${payload.varName}": ${res.statusText}`
		);
	}

	return res.json();
}
