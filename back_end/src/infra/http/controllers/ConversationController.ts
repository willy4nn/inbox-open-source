import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const successResponseSchema = z.any().describe('Lista de conversas retornada com sucesso');

const errorResponseSchema = z.object({
  error: z.string(),
}).describe('Erro ao buscar conversas');

export const getConversationsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/conversation', {
    schema: {
      tags: ['conversation'],
      summary: 'Get conversations',
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

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`
      }
    };
    
    try {
      const apiResponse = await fetch('https://api.chatvolt.ai/conversation', options);
    //   console.log(await apiResponse.json())
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Error from external API:', apiResponse.status, errorData);
        return reply.status(500).send({ error: 'Failed to fetch conversations from external service' });
      }
      const data = await apiResponse.json();
      return reply.status(200).send(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return reply.status(500).send({ error: 'Failed to fetch conversations' });
    }
  });
};
