// src/features/chat/application/use-cases/SubscribeToRoomUseCase.ts
import { Message } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class SubscribeToRoomUseCase {
  // 💡 CORREGIDO: Se tipó con la interfaz abstracta IChatRepository de forma consistente
  constructor(private chatRepository: IChatRepository) {}

  execute(roomId: string, onNewMessage: (message: Message) => void) {
    // Retorna la función de limpieza () => supabase.removeChannel(channel)
    return this.chatRepository.subscribeToMessages(roomId, onNewMessage);
  }
}