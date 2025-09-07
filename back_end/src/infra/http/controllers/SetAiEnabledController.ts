import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota
export const SetAiEnabledSchema = {
    schema: {
        tags: ["conversation"],
        summary: "Habilita ou desabilita a IA para uma conversa",
        params: z.object({
            conversationId: z.string().min(1, "O ID da conversa é obrigatório"),
        }),
        // ALTERADO: O corpo da requisição agora espera a chave "enabled"
        body: z.object({
            enabled: z.boolean().describe("Define se a IA está habilitada"),
        }),
        response: {
            200: z.object({
                success: z.boolean().describe("Indica se a operação foi bem-sucedida"),
                message: z.string().describe("Mensagem de confirmação"),
            }),
            500: z.object({
                error: z.string().describe("Mensagem de erro do servidor"),
            }),
        },
    },
};

// 🔹 Plugin da rota
export const SetAiEnabledRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        "/conversations/:conversationId/set-ai-enabled",
        SetAiEnabledSchema,
        async (request, reply) => {
            if (!process.env.API_KEY) {
                return reply.status(500).send({ error: "API key ausente" });
            }

            const { conversationId } = request.params;
            // ALTERADO: Desestruturação da chave correta "enabled"
            const { enabled } = request.body;

            try {
                const apiResponse = await fetch(
                    // A URL da API externa já estava correta (plural), mantida.
                    `https://api.chatvolt.ai/conversations/${conversationId}/set-ai-enabled`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        // ALTERADO: Enviando a chave correta "enabled" no corpo
                        body: JSON.stringify({ enabled }),
                    }
                );

                const data = await apiResponse.json();

                if (!apiResponse.ok) {
                    console.error("Erro da API externa:", apiResponse.status, data);
                    return reply.status(500).send({ error: "Falha ao atualizar o status da IA" });
                }

                const parsedData = SetAiEnabledSchema.schema.response[200].parse(data);
                return reply.status(200).send(parsedData);

            } catch (error) {
                console.error("Erro ao atualizar o status da IA:", error);
                return reply.status(500).send({ error: "Falha ao processar a requisição" });
            }
        }
    );
};