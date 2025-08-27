export interface Conversation {
    "id": string,
    "title": string,
    "isAiEnabled": true,
    "channel": string,
    "status": string,
    "metadata": any,
    "aiUserIdentifier": string,
    "channelExternalId": string,
    "channelCredentialsId": string,
    "organizationId": string,
    "mailInboxId": string,
    "priority": string,
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