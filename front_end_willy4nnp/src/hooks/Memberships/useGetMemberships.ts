// useGetMemberships.ts
import useSWR from "swr";
import { getMemberships } from "@/services/Memberships/GetMemberships/getMemberships";
import type { getMembershipsResponseDTO } from "@/services/Memberships/GetMemberships/getMembershipsDTO";

export function useGetMemberships() {
	const { data, error, isLoading, mutate } =
		useSWR<getMembershipsResponseDTO>("memberships", getMemberships);

	return {
		memberships: data,
		isLoading,
		isError: !!error,
		mutate,
	};
}
