import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados por rota/função, com descrições e validações
export const ConversationSchemas = {
	// Get Conversations (listagem / filtros)
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
			success: z.any().describe("Lista de conversas filtradas"),
			error: z
				.object({ error: z.string().describe("Mensagem de erro") })
				.describe("Erro da API"),
		},
	},

	// Assign Conversation
	assignConversation: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa a ser atribuída"),
			}),
			body: z.object({
				email: z
					.string()
					.email()
					.describe("Email do usuário que receberá a conversa"),
			}),
		},
		response: {
			success: z
				.object({
					success: z
						.boolean()
						.describe(
							"Indica se a atribuição foi realizada com sucesso"
						),
					message: z.string().describe("Mensagem da operação"),
				})
				.describe("Resposta de atribuição de conversa"),
			error: z
				.object({ error: z.string().describe("Mensagem de erro") })
				.describe("Erro da API"),
		},
	},
};

// 🔹 Plugin único de rotas de conversation
export const getConversationsRoute: FastifyPluginAsyncZod = async (server) => {
	// GET /conversation (listagem/filtros)
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
						method: "GET",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
						},
					}
				);

				const data = await res.json();
				if (!res.ok)
					return reply
						.status(500)
						.send({ error: "Falha ao buscar conversas" });

				return reply.status(200).send(data);
			} catch (err) {
				console.error("Erro fetch conversas:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao buscar conversas" });
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
				if (!res.ok)
					return reply
						.status(500)
						.send({ error: "Falha ao atribuir conversa" });

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
