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
            title: z.string().nullable().default("Sem título"), // Permite null
            assignees: z
              .array(
                z.object({
                  id: z.string().optional(),
                  email: z.string().email().optional(),
                })
              )
              .default([]), // Valor padrão para array vazio
            // Campos opcionais para compatibilidade com a API
            isAiEnabled: z.boolean().optional(),
            channel: z.string().optional(),
            status: z
              .enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"])
              .optional(),
            metadata: z
              .record(z.string(), z.unknown())
              .nullable()
              .default({})
              .optional(),
            channelExternalId: z.string().optional(),
            channelCredentialsId: z.string().nullable().default("").optional(),
            organizationId: z.string().optional(),
            mailInboxId: z.string().nullable().default("").optional(),
            priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
            formId: z.string().nullable().default("").optional(),
            agentId: z.string().nullable().default("").optional(),
            userId: z.string().nullable().default("").optional(), // Permite null
            visitorId: z.string().nullable().default("").optional(),
            frustration: z.number().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            participantsContacts: z
              .array(z.object({ firstName: z.string() }))
              .default([])
              .optional(),
            conversationVariables: z
              .array(
                z.object({
                  conversationId: z.string(),
                  varName: z.string(),
                  varValue: z.string(),
                })
              )
              .default([])
              .optional(),
            conversationContexts: z
              .array(
                z.object({
                  context: z.string(),
                  updatedAt: z.string(),
                })
              )
              .default([])
              .optional(),
            isGroup: z.boolean().optional(),
            aiUserIdentifier: z.string().nullable().default("").optional(), // Permite null
            unreadMessagesCount: z.number().optional(),
            crmScenarioConversations: z.array(z.any()).default([]).optional(), // Campo adicional
          })
        )
        .describe("Lista de conversas filtradas"),
      error: z.object({ error: z.string(), details: z.any().optional() }).describe("Erro da API"),
    },
  },

  // GET /conversation/:conversationId
  getConversationById: {
    request: {
      params: z.object({
        conversationId: z.string().describe("ID da conversa específica"),
      }),
    },
    response: {
      success: z.object({
        id: z.string(),
        title: z.string().nullable().default("Sem título"), // Permite null
        assignees: z
          .array(
            z.object({
              id: z.string().optional(),
              email: z.string().email().optional(),
            })
          )
          .default([]), // Valor padrão
        // Campos opcionais para compatibilidade com a API
        isAiEnabled: z.boolean().optional(),
        channel: z.string().optional(),
        status: z
          .enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"])
          .optional(),
        metadata: z
          .record(z.string(), z.unknown())
          .nullable()
          .default({})
          .optional(),
        channelExternalId: z.string().optional(),
        channelCredentialsId: z.string().nullable().default("").optional(),
        organizationId: z.string().optional(),
        mailInboxId: z.string().nullable().default("").optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        formId: z.string().nullable().default("").optional(),
        agentId: z.string().nullable().default("").optional(),
        userId: z.string().nullable().default("").optional(), // Permite null
        visitorId: z.string().nullable().default("").optional(),
        frustration: z.number().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        participantsContacts: z
          .array(z.object({ firstName: z.string() }))
          .default([])
          .optional(),
        conversationVariables: z
          .array(
            z.object({
              conversationId: z.string(),
              varName: z.string(),
              varValue: z.string(),
            })
          )
          .default([])
          .optional(),
        conversationContexts: z
          .array(z.object({ context: z.string(), updatedAt: z.string() }))
          .default([])
          .optional(),
        isGroup: z.boolean().optional(),
        aiUserIdentifier: z.string().nullable().default("").optional(), // Permite null
        unreadMessagesCount: z.number().optional(),
        crmScenarioConversations: z.array(z.any()).default([]).optional(), // Campo adicional
      }),
      error: z.object({ error: z.string(), details: z.any().optional() }).describe("Erro da API"),
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
				return reply.status(500).send({ error: "API key ausente no servidor" });

			const query =
				ConversationSchemas.getConversations.request.query.parse(
					request.query
				);
			const params = new URLSearchParams();
			if (query.agentId) params.append("agentId", query.agentId);
			if (query.createdAt) params.append("createdAt", query.createdAt);
			if (query.status) params.append("status", query.status);

			try {
				const apiUrl = `https://api.chatvolt.ai/conversation${params.toString() ? `?${params.toString()}` : ""}`;
				
				const res = await fetch(apiUrl, {
					headers: {
						Authorization: `Bearer ${process.env.API_KEY}`,
					},
				});

				if (!res.ok) {
					let errorBody = "Erro desconhecido da API externa.";
					try {
						const errorData: unknown = await res.json();
						// <-- CORREÇÃO 1: Verificação de tipo para 'unknown'
						if (typeof errorData === 'object' && errorData !== null) {
							if ('message' in errorData && typeof errorData.message === 'string') {
								errorBody = errorData.message;
							} else if ('error' in errorData && typeof errorData.error === 'string') {
								errorBody = errorData.error;
							} else {
								errorBody = JSON.stringify(errorData);
							}
						}
					} catch {
						errorBody = `A API externa respondeu com status: ${res.status} ${res.statusText}`;
					}
					console.error("Erro da API externa:", errorBody);
					return reply.status(500).send({ error: `Falha ao buscar conversas: ${errorBody}` });
				}
				
				const data = await res.json();

				const parsedData =
					ConversationSchemas.getConversations.response.success.parse(
						data
					);
				return reply.status(200).send(parsedData);
			} catch (err) {
				console.error("Erro no handler de /conversation:", err);
				
				if (err instanceof z.ZodError) {
					// <-- CORREÇÃO 2: 'details' agora é permitido pelo schema
					return reply.status(500).send({
						error: "A resposta da API externa não corresponde ao formato esperado.",
						details: err.issues,
					});
				}

				return reply
					.status(500)
					.send({ error: "Falha interna ao processar a requisição de conversas" });
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
          200: ConversationSchemas.getConversationById.response.success,
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
          ConversationSchemas.getConversationById.response.success.parse(data);
        return reply.status(200).send(parsedData);
      } catch (err) {
        console.error("Erro fetch conversa pelo ID:", err);
        return reply.status(500).send({ error: "Falha ao buscar conversa" });
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
          200: ConversationSchemas.assignConversation.response.success,
          500: ConversationSchemas.assignConversation.response.error,
        },
      },
    },
    async (request, reply) => {
      if (!process.env.API_KEY)
        return reply.status(500).send({ error: "API key ausente" });

      const { conversationId } = request.params;
      const { email } =
        ConversationSchemas.assignConversation.request.body.parse(request.body);

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
          ConversationSchemas.assignConversation.response.success.parse(data);
        return reply.status(200).send(parsedData);
      } catch (err) {
        console.error("Erro atribuindo conversa:", err);
        return reply.status(500).send({ error: "Falha ao atribuir conversa" });
      }
    }
  );
};
