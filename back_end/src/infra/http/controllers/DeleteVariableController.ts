import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota de deletar variável
export const VariableSchemas = {
	request: {
		// Parâmetros da URL
		params: z.object({
			conversationId: z
				.string()
				.min(1, "ID da conversa é obrigatório"),
			varName: z.string().min(1, "Nome da variável é obrigatório"),
		}),
	},
	response: {
		// Resposta de sucesso
		success: z
			.object({
				message: z.string(),
				deleted: z.object({
					conversationId: z.string(),
					varName: z.string(),
					varValue: z.string(),
				}),
			})
			.describe("Variável deletada com sucesso"),
		// Resposta de erro
		error: z
			.object({ error: z.string().describe("Mensagem de erro") })
			.describe("Erro da API"),
	},
};

// 🔹 Plugin da rota de deletar variável
export const deleteVariableRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		// A rota com os dois parâmetros
		"/variables/:conversationId/:varName",
		{
			schema: {
				tags: ["variables"],
				summary: "Deletar uma variável customizada de uma conversa",
				params: VariableSchemas.request.params,
				response: {
					200: VariableSchemas.response.success,
					500: VariableSchemas.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY) {
				return reply.status(500).send({ error: "API key ausente" });
			}

			const { conversationId, varName } = request.params;

			try {
				const apiResponse = await fetch(
					`https://api.chatvolt.ai/variables/${conversationId}/${varName}`,
					{
						method: "DELETE", // Método HTTP DELETE
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
						},
					}
				);

				const data = await apiResponse.json();

				if (!apiResponse.ok) {
					console.error("Erro da API externa:", apiResponse.status, data);
					return reply.status(500).send({ error: "Falha ao deletar a variável" });
				}

                const parsedData = VariableSchemas.response.success.parse(data);
				return reply.status(200).send(parsedData);

			} catch (error) {
				console.error("Erro ao deletar variável:", error);
				return reply.status(500).send({ error: "Falha ao deletar a variável" });
			}
		}
	);
};