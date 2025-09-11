import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados por rota/função
export const MessageSchemas = {
    // Get Messages (listagem / filtros)
    getMessages: {
        request: {
            params: z.object({
                conversationId: z
                    .string()
                    .describe("ID da conversa específica"),
                count: z
                    .string()
                    .describe("Número de mensagens a serem retornadas"),
            }),
        },
        response: {
            success: z.any().describe("Lista de conversas filtradas"),
            error: z
                .object({ error: z.string().describe("Mensagem de erro") })
                .describe("Erro da API"),
        },
    },

    // Get Conversation By ID
    getMessageById: {
        request: {
            params: z.object({
                messageId: z
                    .string()
                    .describe("ID da Mensagem específica"),
            }),
        },
        response: {
            success: z.any().describe("Detalhes da conversa"),
            error: z
                .object({ error: z.string().describe("Mensagem de erro") })
                .describe("Erro da API"),
        },
    },

    // Get Logs (apenas assignees)
    getLogs: {
        request: {
            params: z.object({
                messageId: z.string().describe("ID da mensagem para buscar logs"),
            }),
        },
        response: {
            success: z.array(
                z.object({
                    id: z.string(),
                    userId: z.string().nullable(),
                })
            ).describe("Lista de assignees"),
            error: z
                .object({ error: z.string().describe("Mensagem de erro") })
                .describe("Erro da API"),
        },
    },
};

// 🔹 Plugin único de rotas de conversation
export const getMessagesRoute: FastifyPluginAsyncZod = async (server) => {
    // GET /conversation/:conversationId/messages/:count
    server.get(
        "/conversation/:conversationId/messages/:count",
        {
            schema: {
                tags: ["messages"],
                summary: "Listar ou filtrar mensagens",
                params: MessageSchemas.getMessages.request.params,
                response: {
                    200: MessageSchemas.getMessages.response.success,
                    500: MessageSchemas.getMessages.response.error,
                },
            },
        },
        async (request, reply) => {
            if (!process.env.API_KEY)
                return reply.status(500).send({ error: "API key ausente" });

            try {
                const res = await fetch(
                    `https://api.chatvolt.ai/conversation/${request.params.conversationId}/messages/${request.params.count}`,
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

    // GET /messages/:messageId
    server.get(
        "/messages/:messageId",
        {
            schema: {
                tags: ["messages"],
                summary: "Detalhes da mensagem por ID",
                params: MessageSchemas.getMessageById.request.params,
                response: {
                    200: MessageSchemas.getMessageById.response.success,
                    500: MessageSchemas.getMessageById.response.error,
                },
            },
        },
        async (request, reply) => {
            if (!process.env.API_KEY)
                return reply.status(500).send({ error: "API key ausente" });

            try {
                const res = await fetch(
                    `https://api.chatvolt.ai/messages/${request.params.messageId}`,
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
                        .send({ error: "Falha ao buscar detalhes da mensagem" });

                return reply.status(200).send(data);
            } catch (err) {
                console.error("Erro fetch detalhes da mensagem:", err);
                return reply
                    .status(500)
                    .send({ error: "Falha ao buscar detalhes da mensagem" });
            }
        }
    );

    // GET /api/logs/:messageId (apenas assignees)
    server.get(
        "/api/logs/:messageId",
        {
            schema: {
                tags: ["logs"],
                summary: "Retorna apenas os assignees de uma mensagem",
                params: MessageSchemas.getLogs.request.params,
                response: {
                    200: MessageSchemas.getLogs.response.success,
                    500: MessageSchemas.getLogs.response.error,
                },
            },
        },
        async (request, reply) => {
            if (!process.env.API_KEY)
                return reply.status(500).send({ error: "API key ausente" });

            try {
                const res = await fetch(
                    `https://api.chatvolt.ai/api/logs/${request.params.messageId}`,
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
                        .send({ error: "Falha ao buscar logs da mensagem" });

                // Validar e tipar usando Zod
                const assigneesSchema = z.object({
                    assignees: z.array(
                        z.object({
                            id: z.string(),
                            userId: z.string().nullable(),
                        })
                    ),
                });

                const parsed = assigneesSchema.parse(data);

                return reply.status(200).send(parsed.assignees);
            } catch (err) {
                console.error("Erro fetch logs:", err);
                return reply
                    .status(500)
                    .send({ error: "Falha ao buscar logs da mensagem" });
            }
        }
    );
};
