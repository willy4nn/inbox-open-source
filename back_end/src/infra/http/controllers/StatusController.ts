import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota de status
export const StatusSchema = {
    setStatus: {
        schema: {
            tags: ["status"],
            description: "Define o status de uma conversa",
            summary: "Define o status de uma conversa",
            params: z.object({
                conversationId: z.string(),
            }),
            body: z.object({
                status: z.enum(["RESOLVED", "UNRESOLVED", "HUMAN_REQUESTED"]).describe("Status da conversa"),
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

// 🔹 Plugin da rota de status
export const StatusRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        // A rota com os dois parâmetros
        "/conversations/:conversationId/set-status",
        
        StatusSchema.setStatus,

        async (request, reply) => {
            if (!process.env.API_KEY) {
                return reply.status(500).send({ error: "API key ausente" });
            }

            const { conversationId } = request.params;

            const { status } = request.body;

            try {
                const apiResponse = await fetch(
                    `https://api.chatvolt.ai/conversations/${conversationId}/set-status`,
                    {
                        method: "POST", // Método HTTP POST
                        headers: {
                            Authorization: `Bearer ${process.env.API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({status}),
                    }
                );

                const data = await apiResponse.json();

                if (!apiResponse.ok) {
                    console.error("Erro da API externa:", apiResponse.status, data);
                    return reply.status(500).send({ error: "Falha ao alterar status" });
                }

                const parsedData = StatusSchema.setStatus.schema.response[200].parse(data);
                return reply.status(200).send(parsedData);

            } catch (error) {
                console.error("Erro ao alterar status:", error);
                return reply.status(500).send({ error: "Falha ao alterar status" });
            }
        }
    );
}