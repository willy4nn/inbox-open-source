import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados, seguindo o padrão da equipe
export const RegisterMessageSchemas = {
	request: {
		params: z.object({
			conversationId: z
				.string()
				.min(1, "ID da conversa é obrigatório"),
		}),
		body: z.object({
			message: z.string().min(1, "O texto da mensagem não pode ser vazio"),
			from: z.enum(["human", "agent"]),
		}),
	},
	response: {
		success: z
			.object({
				success: z.boolean(),
				message: z.object({
					id: z.string(),
					conversationId: z.string(),
					text: z.string(),
					from: z.string(),
					createdAt: z.string(),
				}),
			})
			.describe("Mensagem registrada com sucesso"),
		error: z
			.object({ error: z.string().describe("Mensagem de erro") })
			.describe("Erro da API"),
	},
};

// 🔹 Plugin da rota de registrar mensagem
export const registerMessageRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/conversations/:conversationId/message-register",
		{
			schema: {
				tags: ["conversation"], // Pode ser 'conversation' ou 'messages', como preferirem
				summary: "Registrar uma mensagem em uma conversa",
				params: RegisterMessageSchemas.request.params,
				body: RegisterMessageSchemas.request.body,
				response: {
					200: RegisterMessageSchemas.response.success, // A API da Chatvolt retorna 200
					500: RegisterMessageSchemas.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY) {
				return reply.status(500).send({ error: "API key ausente" });
			}

			const { conversationId } = request.params;
			const { message, from } = request.body;

			try {
				const apiResponse = await fetch(
					`https://api.chatvolt.ai/conversations/${conversationId}/message-register`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ message, from }),
					}
				);

				const data = await apiResponse.json(); // 'data' aqui é do tipo 'unknown'

				if (!apiResponse.ok) {
					console.error("Erro da API externa:", apiResponse.status, data);
                    // Correção do erro 2: Usamos nosso status 500 padronizado
					return reply.status(500).send({ error: "Falha ao registrar a mensagem" });
				}

                // Correção do erro 1: Validamos e garantimos o tipo de 'data' com o Zod.
                const parsedData = RegisterMessageSchemas.response.success.parse(data);

				return reply.status(200).send(parsedData); // Enviamos o dado validado
			} catch (error) {
				console.error("Erro ao registrar mensagem:", error);
				return reply.status(500).send({ error: "Falha ao registrar a mensagem" });
			}
		}
	);
};