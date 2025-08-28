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

const assignBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const assignParamsSchema = z.object({
  conversationId: z.string(),
});

export const assignConversationRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/conversation/:conversationId/assign', {
    schema: {
      tags: ['conversation'],
      summary: 'Assign a conversation to an agent by email',
      params: assignParamsSchema, 
      body: assignBodySchema,     
      response: {
        200: z.object({
          message: z.string(),
        }),
        500: errorResponseSchema,
      }
    },
  }, async (request, reply) => {
    if (!process.env.API_KEY) {
      console.error('API_KEY is not defined in environment variables');
      return reply.status(500).send({ error: 'API key is missing' });
    }

    const { conversationId } = request.params; 
    const { email } = request.body;            

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    };
    
    try {
      const apiResponse = await fetch(`https://api.chatvolt.ai/conversations/${conversationId}/assign`, options);
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Error from external API:', apiResponse.status, errorData);
        return reply.status(500).send({ error: 'Failed to assign conversation' });
      }
      const data = await apiResponse.json();
      return reply.status(200).send({message: "A"});
    } catch (error) {
      console.error('Error assigning conversation:', error);
      return reply.status(500).send({ error: 'Failed to assign conversation' });
    }
  });
};