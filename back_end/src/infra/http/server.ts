import Fastify from 'fastify';
import cors from '@fastify/cors';
import scalarAPIReference from '@scalar/fastify-api-reference'
import { fastifySwagger } from '@fastify/swagger';
import 'dotenv/config'
import { getConversationsRoute } from './controllers/ConversationController';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { agentWebhookRoute } from './controllers/AgentController';
import { getMessagesRoute } from './controllers/MessagesController';
import { registerMessageRoute } from './controllers/RegisterMessageController';
import { sendMessageRoute } from './controllers/SendMessageController';
import { VariableRoute } from './controllers/VariableController';
import { PriorityRoute } from './controllers/PriorityController';
import { StatusRoute } from './controllers/StatusController';
import { SetAiEnabledRoute } from './controllers/SetAiEnabledController';

const server = Fastify();

// server.register(appRoutes,{prefix:'/api'});
if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Middleware API ChatVolt - Inbox',
        version: '1.0.0',
      }
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
  })
}
server.register(cors);
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(getConversationsRoute);
server.register(agentWebhookRoute);
server.register(getMessagesRoute);
server.register(registerMessageRoute);
server.register(sendMessageRoute);
server.register(VariableRoute);
server.register(PriorityRoute);
server.register(StatusRoute);
server.register(SetAiEnabledRoute);

export const app = server;