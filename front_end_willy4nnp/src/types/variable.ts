export interface ConversationVariable {
	conversationId: string;
	varName: string;
	varValue: string;
}

export type DeleteVariableResponse = {
	message: string;
	deleted: ConversationVariable;
};
