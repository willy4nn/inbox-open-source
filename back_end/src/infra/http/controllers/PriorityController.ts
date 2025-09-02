import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota de prioridade
export const PrioritySchemas = {
    setPriority: {
        schema: {
            tags: ["priorities"],
            description: "Define a prioridade de uma conversa",
            summary: "Define a prioridade de uma conversa",
            params: z.object({
                conversationId: z.string(),
            }),
            body: z.object({
                priority: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Nível de prioridade"),
            }),
            response: {
                200: z.object({
                    success: z.boolean().describe("Indica se a operação foi bem-sucedida"),
                    message: z.string().describe("Mensagem de confirmação"),
                }),
                400: z.object({
                    error: z.string().describe("Mensagem de erro"),
                }),
                500: z.object({
                    error: z.string().describe("Mensagem de erro do servidor"),
                }),
            },
        },
    },
};

// 🔹 Plugin da rota de variável
export const PriorityRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        // A rota com os dois parâmetros
        "/conversations/:conversationId/set-priority",
        
        PrioritySchemas.setPriority,

        async (request, reply) => {
            if (!process.env.API_KEY) {
                return reply.status(500).send({ error: "API key ausente" });
            }

            const { conversationId } = request.params;

            const { priority } = request.body;

            try {
                const apiResponse = await fetch(
                    `https://api.chatvolt.ai/conversations/${conversationId}/set-priority`,
                    {
                        method: "POST", // Método HTTP POST
                        headers: {
                            Authorization: `Bearer ${process.env.API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({priority}),
                    }
                );

                const data = await apiResponse.json();

                if (!apiResponse.ok) {
                    console.error("Erro da API externa:", apiResponse.status, data);
                    return reply.status(500).send({ error: "Falha ao mudar a prioridade" });
                }

                const parsedData = PrioritySchemas.setPriority.schema.response[200].parse(data);
                return reply.status(200).send(parsedData);

            } catch (error) {
                console.error("Erro ao mudar prioridade:", error);
                return reply.status(500).send({ error: "Falha ao mudar a prioridade" });
            }
        }
    );
}