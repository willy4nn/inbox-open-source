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

// Defina um esquema para a resposta de sucesso da API externa
const successResponseSchemaAssign = z.object({

  success: z.boolean(),
  message: z.string(),
});

export const assignConversationRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/conversations/:conversationId/assign', {
    schema: {
      tags: ['conversations'],
      summary: 'Assign a conversation to an agent by email',
      params: assignParamsSchema, 
      body: assignBodySchema,     
      response: {
        // Use o esquema que definimos para a resposta da sua rota
        200: successResponseSchemaAssign,
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
      
      // Primeiro, pegamos a resposta como JSON (tipo 'unknown')
      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        console.error('Error from external API:', apiResponse.status, data);
        return reply.status(500).send({ error: 'Failed to assign conversation' });
      }

      // Agora, validamos e tipamos 'data' usando o Zod.
      // Se a validação falhar, um erro será lançado e capturado pelo 'catch'.
      const parsedData = successResponseSchema.parse(data);
      
      // Agora 'parsedData' é do tipo correto e pode ser enviado com segurança.
      return reply.status(200).send(parsedData);

    } catch (error) {
      // O 'catch' também irá capturar erros de validação do Zod
      console.error('Error assigning conversation:', error);
      return reply.status(500).send({ error: 'Failed to assign conversation' });
    }
  });
};