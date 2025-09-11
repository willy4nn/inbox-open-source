import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas para memberships
export const MembershipSchemas = {
	getMemberships: {
		response: {
			success: z
				.array(
					z.object({
						email: z.string().email(),
						name: z.string(),
						image: z.string().nullable(),
						picture: z.string().nullable(),
						customPicture: z.string().nullable(),
					})
				)
				.describe("Lista de membros simplificada"),
			error: z
				.object({ error: z.string().describe("Mensagem de erro") })
				.describe("Erro da API"),
		},
	},
};

// 🔹 Plugin de rotas de memberships
export const getMembershipsRoute: FastifyPluginAsyncZod = async (server) => {
	// GET /api/memberships
	server.get(
		"/api/memberships",
		{
			schema: {
				tags: ["memberships"],
				summary:
					"Lista apenas dados básicos dos usuários em memberships",
				response: {
					200: MembershipSchemas.getMemberships.response.success,
					500: MembershipSchemas.getMemberships.response.error,
				},
			},
		},
		async (_request, reply) => {
			if (!process.env.API_KEY) {
				return reply.status(500).send({ error: "API key ausente" });
			}

			try {
				const res = await fetch(
					`https://api.chatvolt.ai/api/memberships`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
						},
					}
				);

				const data: unknown = await res.json();

				if (!res.ok) {
					return reply
						.status(500)
						.send({ error: "Falha ao buscar memberships" });
				}

				// Extrair apenas os campos necessários
				const simplified = z
					.array(
						z.object({
							user: z.object({
								email: z.string().email(),
								name: z.string(),
								image: z.string().nullable(),
								picture: z.string().nullable(),
								customPicture: z.string().nullable(),
							}),
						})
					)
					.parse(data)
					.map((item) => ({
						email: item.user.email,
						name: item.user.name,
						image: item.user.image,
						picture: item.user.picture,
						customPicture: item.user.customPicture,
					}));

				return reply.status(200).send(simplified);
			} catch (err) {
				console.error("Erro fetch memberships:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao buscar memberships" });
			}
		}
	);
};
