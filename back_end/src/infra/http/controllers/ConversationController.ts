import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados por rota/função
export const ConversationSchemas = {
	// GET /conversation (listagem / filtros)
	getConversations: {
		request: {
			query: z.object({
				agentId: z
					.string()
					.optional()
					.describe("ID do agente responsável pela conversa"),
				createdAt: z
					.string()
					.optional()
					.describe("Data de criação no formato YYYY-MM-DD"),
				status: z
					.enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"])
					.optional()
					.describe("Status da conversa"),
			}),
		},
		response: {
			success: z
				.array(
					z.object({
						id: z.string(),
						title: z.string(),
						isAiEnabled: z.boolean(),
						channel: z.string(),
						status: z.enum([
							"RESOLVED",
							"UNRESOLVED",
							"HUMAN_REQUESTED",
						]),
						metadata: z.record(z.string(), z.unknown()),
						channelExternalId: z.string(),
						channelCredentialsId: z.string(),
						organizationId: z.string(),
						mailInboxId: z.string(),
						priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
						formId: z.string(),
						agentId: z.string(),
						userId: z.string(),
						visitorId: z.string(),
						frustration: z.number(),
						createdAt: z.string(),
						updatedAt: z.string(),
						participantsContacts: z.array(
							z.object({ firstName: z.string() })
						),
						conversationVariables: z.array(
							z.object({
								conversationId: z.string(),
								varName: z.string(),
								varValue: z.string(),
							})
						),
						conversationContexts: z.array(
							z.object({
								context: z.string(),
								updatedAt: z.string(),
							})
						),
						assignees: z.array(
							z.object({
								id: z.string(),
								email: z.string().email(),
							})
						),
					})
				)
				.describe("Lista de conversas filtradas"),
			error: z.object({ error: z.string() }).describe("Erro da API"),
		},
	},

	// GET /conversation/:conversationId
	getConversationById: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa específica"),
			}),
		},
		response: {
			success: z.object({
				id: z.string(),
				title: z.string(),
				isAiEnabled: z.boolean(),
				channel: z.string(),
				status: z.enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"]),
				metadata: z.record(z.string(), z.unknown()), // <-- corrigido
				channelExternalId: z.string(),
				channelCredentialsId: z.string(),
				organizationId: z.string(),
				mailInboxId: z.string(),
				priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
				formId: z.string(),
				agentId: z.string(),
				userId: z.string(),
				visitorId: z.string(),
				frustration: z.number(),
				createdAt: z.string(),
				updatedAt: z.string(),
				participantsContacts: z.array(
					z.object({ firstName: z.string() })
				),
				conversationVariables: z.array(
					z.object({
						conversationId: z.string(),
						varName: z.string(),
						varValue: z.string(),
					})
				),
				conversationContexts: z.array(
					z.object({ context: z.string(), updatedAt: z.string() })
				),
				assignees: z.array(
					z.object({ id: z.string(), email: z.string().email() })
				),
			}),

			error: z.object({ error: z.string() }).describe("Erro da API"),
		},
	},

	// POST /conversation/:conversationId/assign
	assignConversation: {
		request: {
			params: z.object({ conversationId: z.string() }),
			body: z.object({ email: z.string().email() }),
		},
		response: {
			success: z.object({
				success: z.boolean(),
				message: z.string(),
			}),
			error: z.object({ error: z.string() }),
		},
	},
};

// 🔹 Plugin único de rotas de conversation
export const getConversationsRoute: FastifyPluginAsyncZod = async (server) => {
	// GET /conversation
	server.get(
		"/conversation",
		{
			schema: {
				tags: ["conversation"],
				summary: "Listar ou filtrar conversas",
				querystring: ConversationSchemas.getConversations.request.query,
				response: {
					200: ConversationSchemas.getConversations.response.success,
					500: ConversationSchemas.getConversations.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			const query =
				ConversationSchemas.getConversations.request.query.parse(
					request.query
				);
			const params = new URLSearchParams();
			if (query.agentId) params.append("agentId", query.agentId);
			if (query.createdAt) params.append("createdAt", query.createdAt);
			if (query.status) params.append("status", query.status);

			try {
				const res = await fetch(
					`https://api.chatvolt.ai/conversation${
						params.toString() ? `?${params.toString()}` : ""
					}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
						},
					}
				);
				const data = await res.json();
				const parsedData =
					ConversationSchemas.getConversations.response.success.parse(
						data
					);
				return reply.status(200).send(parsedData);
			} catch (err) {
				console.error("Erro fetch conversas:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao buscar conversas" });
			}
		}
	);

	// GET /conversation/:conversationId
	server.get(
		"/conversation/:conversationId",
		{
			schema: {
				tags: ["conversation"],
				summary: "Buscar conversa por ID",
				params: ConversationSchemas.getConversationById.request.params,
				response: {
					200: ConversationSchemas.getConversationById.response
						.success,
					500: ConversationSchemas.getConversationById.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			const { conversationId } = request.params;
			try {
				const res = await fetch(
					`https://api.chatvolt.ai/conversation/${conversationId}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
						},
					}
				);
				const data = await res.json();
				const parsedData =
					ConversationSchemas.getConversationById.response.success.parse(
						data
					);
				return reply.status(200).send(parsedData);
			} catch (err) {
				console.error("Erro fetch conversa pelo ID:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao buscar conversa" });
			}
		}
	);

	// POST /conversation/:conversationId/assign
	server.post(
		"/conversation/:conversationId/assign",
		{
			schema: {
				tags: ["conversation"],
				summary: "Atribuir conversa a um usuário",
				params: ConversationSchemas.assignConversation.request.params,
				body: ConversationSchemas.assignConversation.request.body,
				response: {
					200: ConversationSchemas.assignConversation.response
						.success,
					500: ConversationSchemas.assignConversation.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			const { conversationId } = request.params;
			const { email } =
				ConversationSchemas.assignConversation.request.body.parse(
					request.body
				);

			try {
				const res = await fetch(
					`https://api.chatvolt.ai/conversation/${conversationId}/assign`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email }),
					}
				);
				const data = await res.json();
				const parsedData =
					ConversationSchemas.assignConversation.response.success.parse(
						data
					);
				return reply.status(200).send(parsedData);
			} catch (err) {
				console.error("Erro atribuindo conversa:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao atribuir conversa" });
			}
		}
	);
};
