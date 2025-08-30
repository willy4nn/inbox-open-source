import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota de envio de mensagem
export const SendMessageSchemas = {
	request: {
		// Parâmetros dinâmicos da URL
		params: z.object({
			type: z.enum(["conversationId", "phone", "email"]),
			value: z.string().min(1, "O valor do identificador é obrigatório"),
		}),
		// Corpo da requisição
		body: z.object({
			message: z.string().min(1, "O conteúdo da mensagem é obrigatório"),
			agentId: z.string().optional(),
			channel: z
				.enum([
					"website",
					"dashboard",
					"whatsapp",
					"zapi",
					"telegram",
					"instagramDm",
				])
				.optional(),
			attachments: z
				.array(
					z.object({
						url: z.string().url(),
						name: z.string(),
						mimeType: z.string(),
					})
				)
				.optional(),
			visitorId: z.string().optional(),
			contactId: z.string().optional(),
		}),
	},
	response: {
		// Resposta de sucesso
		success: z
			.object({
				success: z.boolean(),
				message: z.object({
					id: z.string(),
					text: z.string(),
					from: z.enum(["human", "agent"]),
					conversationId: z.string(),
					createdAt: z.string(),
                    // Adicionando outros campos que podem vir (e podem ser nulos)
                    html: z.string().nullable(),
                    sources: z.array(z.any()).nullable(),
                    usage: z.any().nullable(),
                    externalId: z.string().nullable(),
                    userId: z.string().nullable(),
				}),
			})
			.describe("Mensagem enviada com sucesso"),
		// Resposta de erro
		error: z
			.object({ error: z.string().describe("Mensagem de erro") })
			.describe("Erro da API"),
	},
};

// 🔹 Plugin da rota de envio de mensagem
export const sendMessageRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		// A rota com os parâmetros dinâmicos
		"/conversation/message/:type/:value",
		{
			schema: {
				tags: ["conversation", "messages"],
				summary: "Enviar uma mensagem para um canal específico",
				params: SendMessageSchemas.request.params,
				body: SendMessageSchemas.request.body,
				response: {
					200: SendMessageSchemas.response.success,
					500: SendMessageSchemas.response.error,
				},
			},
		},
		async (request, reply) => {
			if (!process.env.API_KEY) {
				return reply.status(500).send({ error: "API key ausente" });
			}

			const { type, value } = request.params;
			const bodyPayload = request.body;

			try {
				const apiResponse = await fetch(
					`https://api.chatvolt.ai/conversation/message/${type}/${value}`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.API_KEY}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(bodyPayload),
					}
				);

				const data = await apiResponse.json();

				if (!apiResponse.ok) {
					console.error("Erro da API externa:", apiResponse.status, data);
					return reply.status(500).send({ error: "Falha ao enviar a mensagem" });
				}

                const parsedData = SendMessageSchemas.response.success.parse(data);

				return reply.status(200).send(parsedData);
			} catch (error) {
				console.error("Erro ao enviar mensagem:", error);
				return reply.status(500).send({ error: "Falha ao enviar a mensagem" });
			}
		}
	);
};