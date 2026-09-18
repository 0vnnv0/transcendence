export interface ChatUser {
	id: number;
	intraName: string;
	avatarUrl?: string;
	customAvatar?: string;
}

export interface ChatMessage {
	id: number;
	chatId: number;
	senderId: number;
	content: string;
	createdAt: string;
	sender: ChatUser;
}

export interface LoadMessagesResponse {
	messages: ChatMessage[];
	nextCursor: number | null;
	participants: ChatUser[];
}

export interface CreateChatResponse {
    chatId: number;
}

export interface ChatPreview {
	id: number;
	updatedAt: string;
	users: ChatUser[];
	messages: { content: string; createdAt: string}[];
}
