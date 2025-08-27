enum ConversationStatus {
    OPEN = "OPEN",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}

enum ConversationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export interface Conversation {
    "id": string,
    "title": string,
    "isAiEnabled": true,
    "channel": string,
    "status": ConversationStatus,
    "metadata": any,
    "channelExternalId": string,
    "channelCredentialsId": string,
    "organizationId": string,
    "mailInboxId": string,
    "priority": ConversationPriority,
    "formId": string,
    "agentId": string,
    "userId": string,
    "visitorId": string,
    "frustration": number,
    "createdAt": Date,
    "updatedAt": Date,
    "participantsContacts": [
        {
            "firstName": string
        }
    ],
    "conversationVariables": [
        {
            "conversationId": string,
            "varName": string,
            "varValue": string
        }
    ],
    "conversationContexts": [
        {
            "context": string,
            "updatedAt": Date
        }
    ]
}
import { z } from "zod"

export const ConversationSchema = z.object({
    id: z.string(),
    title: z.string(),
    isAiEnabled: z.boolean(),
    channel: z.string(),
    status: z.nativeEnum(ConversationStatus),
    metadata: z.any(),
    channelExternalId: z.string(),
    channelCredentialsId: z.string(),
    organizationId: z.string(),
    mailInboxId: z.string(),
    priority: z.nativeEnum(ConversationPriority),
    formId: z.string(),
    agentId: z.string(),
    userId: z.string(),
    visitorId: z.string(),
    frustration: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    participantsContacts: z.array(z.object({
        firstName: z.string()
    })),
    conversationVariables: z.array(z.object({
        conversationId: z.string(),
        varName: z.string(),
        varValue: z.string()
    })),
    conversationContexts: z.array(z.object({
        context: z.string(),
        updatedAt: z.date()
    }))
})
