import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schema de uma conversa (igual ao retorno real da API)
const ConversationSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	unreadMessagesCount: z.number(),
	isAiEnabled: z.boolean(),
	channel: z.string(),
	status: z.enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"]),
	metadata: z.record(z.string(), z.unknown()).nullable(),
	channelExternalId: z.string(),
	channelCredentialsId: z.string().nullable(),
	organizationId: z.string(),
	mailInboxId: z.string().nullable(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	formId: z.string().nullable(),
	agentId: z.string().nullable(),
	userId: z.string().nullable(),
	visitorId: z.string().nullable(),
	isGroup: z.boolean(),
	frustration: z.number(),
	aiUserIdentifier: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	lastHumanInteractionAt: z.string().nullable(),

	participantsContacts: z.array(z.unknown()),
	conversationContexts: z.array(
		z.object({
			context: z.string(),
			updatedAt: z.string(),
		})
	),
	conversationVariables: z.array(z.unknown()),
	crmScenarioConversations: z.array(z.unknown()),

	// 🔹 Agora opcional
	assignees: z
		.array(
			z.object({
				user: z.object({
					id: z.string(),
					name: z.string(),
					email: z.string().email(),
				}),
			})
		)
		.optional(),
});

// 🔹 Schemas agrupados
export const ConversationSchemas = {
	getConversations: {
		request: {
			query: z.object({
				agentId: z.string().optional(),
				createdAt: z.string().optional(),
				status: z
					.enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"])
					.optional(),
			}),
		},
		response: {
			success: z.array(ConversationSchema),
			error: z.object({ error: z.string(), details: z.any().optional() }),
		},
	},

	getConversationById: {
		request: {
			params: z.object({
				conversationId: z.string(),
			}),
		},
		response: {
			success: ConversationSchema,
			error: z.object({ error: z.string(), details: z.any().optional() }),
		},
	},

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
			error: z.object({ error: z.string(), details: z.any().optional() }),
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
				return reply
					.status(500)
					.send({ error: "API key ausente no servidor" });

			const query =
				ConversationSchemas.getConversations.request.query.parse(
					request.query
				);
			const params = new URLSearchParams();
			if (query.agentId) params.append("agentId", query.agentId);
			if (query.createdAt) params.append("createdAt", query.createdAt);
			if (query.status) params.append("status", query.status);

			try {
				const apiUrl = `https://api.chatvolt.ai/conversation${
					params.toString() ? `?${params.toString()}` : ""
				}`;

				const res = await fetch(apiUrl, {
					headers: { Authorization: `Bearer ${process.env.API_KEY}` },
				});

				const data = await res.json();

				const parsedData =
					ConversationSchemas.getConversations.response.success.parse(
						data
					);

				// 🔹 Log depois de passar no schema
				console.log(
					"✅ Conversas (validadas pelo schema):",
					parsedData
				);

				return reply.status(200).send(parsedData);
			} catch (err) {
				console.error("Erro no handler de /conversation:", err);

				if (err instanceof z.ZodError) {
					return reply.status(500).send({
						error: "A resposta da API externa não corresponde ao formato esperado.",
						details: err.issues,
					});
				}

				return reply.status(500).send({
					error: "Falha interna ao processar a requisição de conversas",
				});
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

				console.log(
					"✅ Conversa única (validada pelo schema):",
					parsedData
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

				console.log(
					"✅ Resultado assign (validado pelo schema):",
					parsedData
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
