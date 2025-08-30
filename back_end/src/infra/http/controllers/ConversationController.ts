import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados por rota/função, com descrições e validações
export const ConversationSchemas = {
	// Get Messages
	getMessages: {
		response: {
			success: z.any().describe("Lista de todas as conversas"),
			error: z
				.object({ error: z.string().describe("Mensagem de erro") })
				.describe("Erro da API"),
		},
	},

	// Get Conversations by Date
	getConversationsByDate: {
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

	// Assign to User
	assignToUser: {
		request: {
			params: z.object({
				conversationId: z
					.string()
					.describe("ID da conversa a ser atribuída"),
			}),
			query: z.object({
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
	// Listar todas as conversas
	server.get(
		"/conversation",
		{
			schema: {
				tags: ["conversation"],
				summary: "Listar todas as conversas",
				response: {
					200: ConversationSchemas.getMessages.response.success,
					500: ConversationSchemas.getMessages.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			try {
				const res = await fetch(
					"https://api.chatvolt.ai/conversation",
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

	// Listar conversas por data/agente/status
	server.get(
		"/conversation/by-date",
		{
			schema: {
				tags: ["conversation"],
				summary: "Listar conversas filtradas por data, agente e status",
				querystring:
					ConversationSchemas.getConversationsByDate.request.query,
				response: {
					200: ConversationSchemas.getConversationsByDate.response
						.success,
					500: ConversationSchemas.getConversationsByDate.response
						.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			const query =
				ConversationSchemas.getConversationsByDate.request.query.parse(
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
						.send({ error: "Falha ao buscar conversas filtradas" });
				return reply.status(200).send(data);
			} catch (err) {
				console.error("Erro fetch conversas por data:", err);
				return reply
					.status(500)
					.send({ error: "Falha ao buscar conversas filtradas" });
			}
		}
	);

	// Assign to User
	server.get(
		"/conversations/:conversationId/assignToUser",
		{
			schema: {
				tags: ["conversation"],
				summary: "Atribuir conversa via query string",
				params: ConversationSchemas.assignToUser.request.params,
				querystring: ConversationSchemas.assignToUser.request.query,
				response: {
					200: ConversationSchemas.assignToUser.response.success,
					500: ConversationSchemas.assignToUser.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY)
				return reply.status(500).send({ error: "API key ausente" });

			const { conversationId } = request.params;
			const { email } = request.query;

			try {
				const res = await fetch(
					`https://api.chatvolt.ai/conversations/${conversationId}/assignToUser`,
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
					ConversationSchemas.assignToUser.response.success.parse(
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
