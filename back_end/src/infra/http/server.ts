// src/infra/http/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import scalarAPIReference from "@scalar/fastify-api-reference";
import { fastifySwagger } from "@fastify/swagger";
import "dotenv/config";

import { getConversationsRoute } from "../http/controllers/ConversationController";
import { agentWebhookRoute } from "../http/controllers/AgentController";
import { getMessagesRoute } from "../http/controllers/MessagesController";
import { registerMessageRoute } from "../http/controllers/RegisterMessageController";
import { sendMessageRoute } from "../http/controllers/SendMessageController";
import { VariableRoute } from "../http/controllers/VariableController";
import { PriorityRoute } from "../http/controllers/PriorityController";
import { StatusRoute } from "../http/controllers/StatusController";
import { SetAiEnabledRoute } from "../http/controllers/SetAiEnabledController";
import { getMembershipsRoute } from "../http/controllers/MembershipsController";
import { conversationTagsRoute } from "../http/controllers/TagsController";
import { conversationFrustrationRoute } from "../http/controllers/FrustrationController";

import {
	validatorCompiler,
	serializerCompiler,
	jsonSchemaTransform,
} from "fastify-type-provider-zod";

const server = Fastify();

// Swagger + Scalar API Reference (apenas dev)
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

// 🔹 CORS configurado para aceitar qualquer origem
server.register(cors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// 🔹 Registrar rotas
server.register(getConversationsRoute);
server.register(agentWebhookRoute);
server.register(getMessagesRoute);
server.register(registerMessageRoute);
server.register(sendMessageRoute);
server.register(VariableRoute);
server.register(PriorityRoute);
server.register(StatusRoute);
server.register(SetAiEnabledRoute);
server.register(getMembershipsRoute);
server.register(conversationTagsRoute);
server.register(conversationFrustrationRoute);

// 🔹 Mantém o servidor rodando
const PORT = Number(process.env.PORT) || 5000;
server
	.listen({ port: PORT, host: "0.0.0.0" })
	.then(() =>
		console.log(`🚀 Servidor HTTP rodando em http://localhost:${PORT}`)
	)
	.catch((err) => {
		console.error("❌ Erro ao iniciar servidor:", err);
		process.exit(1);
	});

// 🔹 Exporta para permitir import { app } em outros arquivos
export const app = server;
