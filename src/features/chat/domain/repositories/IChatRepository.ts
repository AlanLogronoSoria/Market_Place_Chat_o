// src/features/chat/domain/repositories/IChatRepository.ts
import { Message } from "../entities/Message"; // Ajusta si tienes tus mensajes aquí
import { Room } from "../entities/Room";

export interface IChatRepository {
  getRooms(userId: string, role: string): Promise<Room[]>;
  
  // 💡 Aquí está la corrección: Añadimos productId
  createRoom(userId: string, productId: string, productName: string): Promise<Room>;
  
  getMessages(roomId: string): Promise<Message[]>;
  sendMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message>;
  subscribeToMessages(roomId: string, callback: (message: Message) => void): () => void;
}