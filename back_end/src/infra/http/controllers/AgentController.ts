import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const errorResponseSchema = z.object({
  error: z.string(),
}).describe('Erro ao atualizar o webhook do agente');

const agentParamsSchema = z.object({
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

const webhookQuerySchema = z.object({
  type: z.enum(['whatsapp', 'telegram', 'zapi', 'instagram'], {
    message: "Type must be one of 'whatsapp', 'telegram', 'zapi', 'instagram'"
  }),
  enabled: z.coerce.boolean(),
});

const successResponseSchema = z.string().describe('Webhook status updated successfully');

// Schema resumido do agente para o GET /agents
const agentSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  modelName: z.string(),
}).describe('Summary of an agent');

const agentsResponseSchema = z.array(agentSummarySchema).describe('List of agents');

// Schema completo parcial para validar o retorno da API
const agentFullSchema = z.object({
  id: z.string(),
  name: z.string(),
  modelName: z.string(),
}).passthrough(); // permite outros campos

const agentsFullResponseSchema = z.array(agentFullSchema);

export const agentWebhookRoute: FastifyPluginAsyncZod = async (server) => {

  // PATCH: atualizar webhook
  server.patch('/agents/:agentId/webhook', {
    schema: {
      tags: ['agents'],
      summary: 'Enable or disable an agent integration webhook',
      params: agentParamsSchema,
      querystring: webhookQuerySchema,
      response: {
        200: successResponseSchema,
        500: errorResponseSchema,
      }
    },
  }, async (request, reply) => {
    if (!process.env.API_KEY) {
      console.error('API_KEY is not defined in environment variables');
      return reply.status(500).send({ error: 'API key is missing' });
    }

    const { agentId } = request.params;
    const { type, enabled } = request.query;

    const targetUrl = new URL(`https://api.chatvolt.ai/agents/${agentId}/webhook`);
    targetUrl.searchParams.append('type', type);
    targetUrl.searchParams.append('enabled', String(enabled));

    const options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      }
    };
    
    try {
      const apiResponse = await fetch(targetUrl.toString(), options);
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Error from external API:', apiResponse.status, errorData);
        return reply.status(500).send({ error: 'Failed to update agent webhook' });
      }
      const data = await apiResponse.text();
      return reply.status(200).send(data);
    } catch (error) {
      console.error('Error updating agent webhook:', error);
      return reply.status(500).send({ error: 'Failed to update agent webhook' });
    }
  });

  // GET: listar agentes (apenas id, name, modelName)
  server.get('/agents', {
    schema: {
      tags: ['agents'],
      summary: 'List all agents (id, name, modelName)',
      response: {
        200: agentsResponseSchema,
        500: errorResponseSchema,
      }
    },
  }, async (request, reply) => {
    if (!process.env.API_KEY) {
      console.error('API_KEY is not defined in environment variables');
      return reply.status(500).send({ error: 'API key is missing' });
    }

    try {
      const apiResponse = await fetch('https://api.chatvolt.ai/agents', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Error fetching agents:', apiResponse.status, errorData);
        return reply.status(500).send({ error: 'Failed to fetch agents' });
      }

      const data = await apiResponse.json();

      // Valida o retorno completo
      const parsedFullData = agentsFullResponseSchema.parse(data);

      // Map para retornar apenas os campos desejados
      const filteredData = parsedFullData.map(agent => ({
        id: agent.id,
        name: agent.name,
        modelName: agent.modelName,
      }));

      return reply.status(200).send(filteredData);
    } catch (error) {
      console.error('Error fetching agents:', error);
      return reply.status(500).send({ error: 'Failed to fetch agents' });
    }
  });
};
