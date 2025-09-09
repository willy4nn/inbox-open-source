export interface Message {
	id: string;
	conversationId: string;
	sender: string; // veio do "from" no backend
	text: string; // veio do "text" no backend
	timestamp: string; // veio do "createdAt" no backend
}
