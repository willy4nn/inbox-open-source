import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados por rota/função
export const ConversationTagsSchemas = {
	addTag: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa para adicionar a tag"),
			}),
			body: z.object({
				tag: z.string().min(1).describe("Nome da tag a ser adicionada"),
			}),
		},
		response: {
			success: z.object({
				success: z.boolean(),
				tag: z.object({
					id: z.string(),
					conversationId: z.string(),
					agentId: z.string(),
					tag: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
				}),
			}),
			error: z.object({ error: z.string() }),
		},
	},

	removeTag: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa para remover a tag"),
			}),
			body: z.object({
				tag: z.string().min(1).describe("Nome da tag a ser removida"),
			}),
		},
		response: {
			success: z.object({
				success: z.boolean(),
				message: z.string(),
			}),
			error: z.object({ error: z.string() }),
		},
	},

	listTagsFromLogs: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa para listar tags"),
			}),
		},
		response: {
			success: z.array(
				z.object({
					id: z.string(),
					conversationId: z.string(),
					agentId: z.string(),
					tag: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
				})
			),
			error: z.object({ error: z.string() }),
		},
	},
};

// 🔹 Plugin único de rotas de conversation tags
export const conversationTagsRoute: FastifyPluginAsyncZod = async (server) => {
	// POST /api/conversations/:conversationId/tags
	server.post(
		"/api/conversations/:conversationId/tags",
		{
			schema: {
				tags: ["conversations"],
				summary: "Adicionar uma tag a uma conversa",
				params: ConversationTagsSchemas.addTag.request.params,
				body: ConversationTagsSchemas.addTag.request.body,
				response: {
					200: ConversationTagsSchemas.addTag.response.success,
					500: ConversationTagsSchemas.addTag.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			try {
				const res = await fetch(
					`https://app.chatvolt.ai/api/conversations/${request.params.conversationId}/tags`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(request.body),
					}
				);

				const data: unknown = await res.json();

				if (!res.ok)
					return reply
						.status(500)
						.send({ error: "Falha ao adicionar tag" });

				const parsed =
					ConversationTagsSchemas.addTag.response.success.parse(data);

				return reply.status(200).send(parsed);
			} catch (err) {
				console.error("Erro ao adicionar tag:", err);
				return reply
					.status(500)
					.send({ error: "Erro interno ao adicionar tag" });
			}
		}
	);

	// DELETE /api/conversations/:conversationId/tags
	server.delete(
		"/api/conversations/:conversationId/tags",
		{
			schema: {
				tags: ["conversations"],
				summary: "Remover uma tag de uma conversa",
				params: ConversationTagsSchemas.removeTag.request.params,
				body: ConversationTagsSchemas.removeTag.request.body,
				response: {
					200: ConversationTagsSchemas.removeTag.response.success,
					500: ConversationTagsSchemas.removeTag.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			try {
				const res = await fetch(
					`https://app.chatvolt.ai/api/conversations/${request.params.conversationId}/tags`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(request.body),
					}
				);

				const data: unknown = await res.json();

				if (!res.ok)
					return reply
						.status(500)
						.send({ error: "Falha ao remover tag" });

				const parsed =
					ConversationTagsSchemas.removeTag.response.success.parse(
						data
					);

				return reply.status(200).send(parsed);
			} catch (err) {
				console.error("Erro ao remover tag:", err);
				return reply
					.status(500)
					.send({ error: "Erro interno ao remover tag" });
			}
		}
	);

	// NOVA rota: GET /api/conversations/:conversationId/tags (via logs)
	server.get(
		"/api/conversations/:conversationId/tags",
		{
			schema: {
				tags: ["conversations"],
				summary: "Listar tags de uma conversa via logs",
				params: ConversationTagsSchemas.listTagsFromLogs.request.params,
				response: {
					200: ConversationTagsSchemas.listTagsFromLogs.response
						.success,
					500: ConversationTagsSchemas.listTagsFromLogs.response
						.error,
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
						.send({ error: "Falha ao listar tags" });

				// Extrair apenas as tags
				const logsSchema = z.object({
					tags: z.array(
						z.object({
							id: z.string(),
							conversationId: z.string(),
							agentId: z.string(),
							tag: z.string(),
							createdAt: z.string(),
							updatedAt: z.string(),
						})
					),
				});

				const parsed = logsSchema.parse(data);

				return reply.status(200).send(parsed.tags);
			} catch (err) {
				console.error("Erro ao listar tags via logs:", err);
				return reply
					.status(500)
					.send({ error: "Erro interno ao listar tags" });
			}
		}
	);
};
