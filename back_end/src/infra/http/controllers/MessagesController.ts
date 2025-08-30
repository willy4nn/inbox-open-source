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
};

// 🔹 Plugin único de rotas de conversation
export const getMessagesRoute: FastifyPluginAsyncZod = async (server) => {
    // GET /conversation/:conversationId/messages/:count (listagem/filtros)
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

    // GET /messages/:messageId (detalhes da mensagem)
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
};
