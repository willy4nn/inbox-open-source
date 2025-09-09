import Fastify from "fastify";
import cors from "@fastify/cors";
import scalarAPIReference from "@scalar/fastify-api-reference";
import { fastifySwagger } from "@fastify/swagger";
import "dotenv/config";
import { getConversationsRoute } from "./controllers/ConversationController";
import {
	validatorCompiler,
	serializerCompiler,
	jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { agentWebhookRoute } from "./controllers/AgentController";
import { getMessagesRoute } from "./controllers/MessagesController";
import { registerMessageRoute } from "./controllers/RegisterMessageController";
import { sendMessageRoute } from "./controllers/SendMessageController";
import { VariableRoute } from "./controllers/VariableController";
import { PriorityRoute } from "./controllers/PriorityController";
import { StatusRoute } from "./controllers/StatusController";
import { SetAiEnabledRoute } from "./controllers/SetAiEnabledController";

const server = Fastify();

if (process.env.NODE_ENV === "development") {
	server.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Middleware API ChatVolt - Inbox",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});

	server.register(scalarAPIReference, {
		routePrefix: "/docs",
	});
}

// 🔹 Configuração de CORS para aceitar todas as origens e métodos
server.register(cors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// 🔹 Rotas
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
