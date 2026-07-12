export interface User {
  id: string; // oder number, je nach Prisma-Setup
  username: string;
  avatarUrl?: string;
}

export interface CreateChatResponse {
  chatId: number;
  message: string;
}