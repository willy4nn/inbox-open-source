import type {
	DeleteVariableRequestDTO,
	DeleteVariableResponseDTO,
} from "@/services/Variable/DeleteVariable/deleteVariableDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Delete a variable from a conversation
export async function deleteVariable(
	payload: DeleteVariableRequestDTO
): Promise<DeleteVariableResponseDTO> {
	const url = `${BASE_URL}/variables/${encodeURIComponent(
		payload.conversationId
	)}/${encodeURIComponent(payload.varName)}`;

	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // optional if required
		},
		body: JSON.stringify(payload), // ⚡ Important: send the JSON body
	});

	let data: DeleteVariableResponseDTO | { error: string };

	try {
		data = await res.json();
	} catch {
		throw new Error("Failed to delete variable: invalid server response");
	}

	if (!res.ok) {
		const errorMessage =
			data && "error" in data && typeof data.error === "string"
				? data.error
				: "Failed to delete variable";
		throw new Error(errorMessage);
	}

	return data as DeleteVariableResponseDTO;
}
