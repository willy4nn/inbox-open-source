import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schema para buscar frustration
export const ConversationFrustrationSchema = {
	request: {
		params: z.object({
			conversationId: z
				.string()
				.describe("ID da conversa para buscar frustration"),
		}),
	},
	response: {
		success: z.object({
			frustration: z.number(),
		}),
		error: z.object({
			error: z.string(),
		}),
	},
};

// 🔹 Plugin de rota
export const conversationFrustrationRoute: FastifyPluginAsyncZod = async (
	server
) => {
	server.get(
		"/api/conversations/:conversationId/frustration",
		{
			schema: {
				tags: ["conversations"],
				summary: "Retorna somente a frustration de uma conversa",
				params: ConversationFrustrationSchema.request.params,
				response: {
					200: ConversationFrustrationSchema.response.success,
					500: ConversationFrustrationSchema.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			try {
				const res = await fetch(
					`https://app.chatvolt.ai/api/logs/${request.params.conversationId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							Accept: "application/json",
						},
					}
				);

				const data: unknown = await res.json();

				if (!res.ok)
					return reply
						.status(500)
						.send({ error: "Falha ao buscar frustration" });

				// Extrair apenas a frustration
				const frustrationSchema = z.object({
					frustration: z.number(),
				});

				const parsed = frustrationSchema.parse(data);

				return reply.status(200).send(parsed);
			} catch (err) {
				console.error("Erro ao buscar frustration:", err);
				return reply
					.status(500)
					.send({ error: "Erro interno ao buscar frustration" });
			}
		}
	);
};
