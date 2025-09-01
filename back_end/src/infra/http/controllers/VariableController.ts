import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// 🔹 Schemas agrupados para a rota de variável
export const VariableSchemas = {
	deleteVariable: {
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
	},
	getAllVariable: {
		schema: {
			tags: ['variables'],
			summary: 'Listar todas as variáveis customizadas de uma conversa',
			params: z.object({
				conversationId: z.string().min(1, 'ID da conversa é obrigatório'),
			}),
			response: {
				200: z.array(z.object({
					conversationId: z.string(),
					varName: z.string(),
					varValue: z.string(),
				})).describe('Variáveis customizadas listadas com sucesso'),
				500: z.object({ error: z.string().describe('Mensagem de erro') }).describe('Erro da API'),
			},
		},
	},
	getOneVariable: {
		schema: {
			tags: ['variables'],
			summary: 'Obter o valor de uma variável customizada específica de uma conversa',
			params: z.object({
				conversationId: z.string().min(1, 'ID da conversa é obrigatório'),
				varName: z.string().min(1, 'Nome da variável é obrigatório'),
			}),
			response: {
				200: z.object({
					conversationId: z.string(),
					varName: z.string(),
					varValue: z.string(),
				}).describe('Variável customizada obtida com sucesso'),
				500: z.object({ error: z.string().describe('Mensagem de erro') }).describe('Erro da API'),
			},
		},
	},
	upsertVariable: {
		schema: {
			tags: ['variables'],
			summary: 'Criar uma nova variável customizada para uma conversa',
			body: z.object({
				conversationId: z.string().min(1, 'ID da conversa é obrigatório'),
				varName: z.string().min(1, 'Nome da variável é obrigatório'),
				varValue: z.string().min(1, 'Valor da variável é obrigatório'),
			}),
			response: {
				200: z.object({
					conversationId: z.string(),
					varName: z.string(),
					varValue: z.string(),
				}).describe('Variável customizada criada com sucesso'),
				500: z.object({ error: z.string().describe('Mensagem de erro') }).describe('Erro da API'),
			},
		},
	}
};

// 🔹 Plugin da rota de variável
export const VariableRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		// A rota com os dois parâmetros
		"/variables/:conversationId/:varName",
		{
			schema: {
				tags: ["variables"],
				summary: "Deletar uma variável customizada de uma conversa",
				params: VariableSchemas.deleteVariable.request.params,
				response: {
					200: VariableSchemas.deleteVariable.response.success,
					500: VariableSchemas.deleteVariable.response.error,
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

				const parsedData = VariableSchemas.deleteVariable.response.success.parse(data);
				return reply.status(200).send(parsedData);

			} catch (error) {
				console.error("Erro ao deletar variável:", error);
				return reply.status(500).send({ error: "Falha ao deletar a variável" });
			}
		}
	);
	server.get('/variables/:conversationId', VariableSchemas.getAllVariable, async (request, reply) => {
		if (!process.env.API_KEY) {
			return reply.status(500).send({ error: 'API key ausente' });
		}

		const { conversationId } = request.params;

		try {
			const apiResponse = await fetch(`https://api.chatvolt.ai/variables/${conversationId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			});

			const data = await apiResponse.json();

			if (!apiResponse.ok) {
				console.error('Erro da API externa:', apiResponse.status, data);
				return reply.status(500).send({ error: 'Falha ao buscar as variáveis' });
			}
			const parsedData = VariableSchemas.getAllVariable.schema.response[200].parse(data);
			return reply.status(200).send(parsedData);
		} catch (error) {
			console.error('Erro ao buscar variáveis:', error);
			return reply.status(500).send({ error: 'Falha ao buscar as variáveis' });
		}
	});
	server.get('/variables/:conversationId/:varName', VariableSchemas.getOneVariable, async (request, reply) => {
		if (!process.env.API_KEY) {
			return reply.status(500).send({ error: 'API key ausente' });
		}

		const { conversationId, varName } = request.params;

		try {
			const apiResponse = await fetch(`https://api.chatvolt.ai/variables/${conversationId}/${varName}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			});

			const data = await apiResponse.json();

			if (!apiResponse.ok) {
				console.error('Erro da API externa:', apiResponse.status, data);
				return reply.status(500).send({ error: 'Falha ao buscar a variável' });
			}
			const parsedData = VariableSchemas.getOneVariable.schema.response[200].parse(data);
			return reply.status(200).send(parsedData);
		} catch (error) {
			console.error('Erro ao buscar variável:', error);
			return reply.status(500).send({ error: 'Falha ao buscar a variável' });
		}
	});
	server.post('/variables', VariableSchemas.upsertVariable, async (request, reply) => {
		if (!process.env.API_KEY) {
			return reply.status(500).send({ error: 'API key ausente' });
		}
		const { conversationId, varName, varValue } = request.body;

		try {
			const apiResponse = await fetch(`https://api.chatvolt.ai/variables`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					conversationId,
					varName,
					varValue,
				}),
			});
			const data = await apiResponse.json();
			if (!apiResponse.ok) {
				console.error('Erro da API externa:', apiResponse.status, data);
				return reply.status(500).send({ error: 'Falha ao criar a variável' });
			}
			const parsedData = VariableSchemas.upsertVariable.schema.response[200].parse(data);
			return reply.status(200).send(parsedData);
		} catch (error) {
			console.error('Erro ao criar variável:', error);
			return reply.status(500).send({ error: 'Falha ao criar a variável' });
		}
	});
}