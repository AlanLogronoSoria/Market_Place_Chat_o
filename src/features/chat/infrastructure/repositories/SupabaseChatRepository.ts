import { supabase } from '../../../../shared/infrastructure/supabase/client';
import { Message } from '../../domain/entities/Message';
import { Room } from '../../domain/entities/Room';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class SupabaseChatRepository implements IChatRepository {
    
    /**
     * Obtiene el historial de mensajes de una sala específica
     */
async getMessages(roomId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });

        if (error) throw new Error(`Error al obtener mensajes: ${error.message}`);

        return (data || []).map(dbMsg => ({
            id: dbMsg.id,
            roomId: dbMsg.room_id,
            userId: dbMsg.user_id,
            content: dbMsg.content,
            imageUrl: dbMsg.image_url,
            createdAt: new Date(dbMsg.created_at),
            authorUsername: dbMsg.author_username || 'Usuario'
        }));
    }

    /**
     * Envía un mensaje de texto o imagen a una sala de chat
     */
   async sendMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                room_id: message.roomId,
                user_id: message.userId,
                content: message.content,
                image_url: message.imageUrl,
            }])
            .select()
            .single();

        if (error) throw new Error(`Error al enviar mensaje: ${error.message}`);

        return {
            id: data.id,
            roomId: data.room_id,
            userId: data.user_id,
            content: data.content,
            imageUrl: data.image_url,
            createdAt: new Date(data.created_at),
            authorUsername: data.author_username || 'Usuario'
        };
    }

   // src/features/chat/infrastructure/repositories/SupabaseChatRepository.ts

subscribeToMessages(roomId: string, onNewMessage: (message: any) => void) {
  // 1. Crear la referencia del canal
  const channelId = `room-${roomId}`;
  
  const channel = supabase
    .channel(channelId)
    // 2. CONFIGURAR PRIMERO: Escuchar los cambios de la base de datos
    .on(
      'postgres_changes',
      {
        event: 'INSERT', // Escucha solo nuevos mensajes creados
        schema: 'public',
        table: 'messages', // Verifica si tu tabla se llama 'messages' o 'mensajes'
        filter: `room_id=eq.${roomId}`, // Filtra para recibir solo los de esta sala
      },
      (payload) => {
        // Ejecuta el callback con el nuevo registro inyectado
        onNewMessage(payload.new);
      }
    );

  // 3. SUSCRIBIRSE AL FINAL: Una vez mapeados todos los listeners
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log(`🟢 Conectado con éxito al tiempo real de la sala: ${roomId}`);
    }
  });

  // 4. RETORNAR LIMPIEZA: Retorna la función que remueve este canal específico
  return () => {
    console.log(`🔴 Removiendo canal de tiempo real: ${channelId}`);
    supabase.removeChannel(channel);
  };
}

    /**
     * Obtiene las salas según el rol y el usuario autenticado
     */
   /**
     * Obtiene las salas según el rol y el usuario autenticado
     */
    async getRooms(userId: string, role: string): Promise<Room[]> {
        const normalizedRole = role?.toLowerCase().trim();

        if (normalizedRole === "cliente" || normalizedRole === "client") {
            const { data, error } = await supabase
                .from("rooms")
                .select("*, products(name)")
                .eq("created_by", userId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching rooms:", error);
                return [];
            }

            return (data || []).map((r: any) => ({
                id: r.id,
                name: r.products?.name || r.name || "",
                productName: r.products?.name || r.product_name || "Sin nombre",
                createdBy: r.created_by,
                createdAt: r.created_at,
                productId: r.product_id // 💡 Listo, mapeado sin errores
            }));
        } else {
            const { data: myProducts } = await supabase
                .from("products")
                .select("id")
                .eq("seller_id", userId);

            const productIds = myProducts?.map((p) => p.id) || [];

            if (productIds.length === 0) return [];

            const { data, error } = await supabase
                .from("rooms")
                .select("*, products(name)")
                .in("product_id", productIds)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching rooms:", error);
                return [];
            }

            return (data || []).map((r: any) => ({
                id: r.id,
                name: r.products?.name || r.name || "",
                productName: r.products?.name || r.product_name || "Sin nombre",
                createdBy: r.created_by,
                createdAt: r.created_at,
                productId: r.product_id
            }));
        }
    }

    /**
     * Crea una nueva sala vinculada a un producto o devuelve una existente
     */
    async createRoom(userId: string, productId: string, productName: string): Promise<Room> {
        const { data: existingRoom } = await supabase
            .from('rooms')
            .select('*')
            .eq('created_by', userId)
            .eq('product_id', productId)
            .maybeSingle();

        if (existingRoom) {
            return {
                id: existingRoom.id,
                name: existingRoom.name,
                productName: existingRoom.product_name,
                createdBy: existingRoom.created_by,
                createdAt: existingRoom.created_at,
                productId: existingRoom.product_id
            };
        }

        const { data, error } = await supabase
            .from('rooms')
            .insert([{ 
                created_by: userId, 
                product_id: productId,
                product_name: productName,
                name: productName 
            }])
            .select()
            .single();

        if (error) throw new Error(`Error al crear sala: ${error.message}`);

        return {
            id: data.id,
            name: data.name,
            productName: data.product_name,
            createdBy: data.created_by,
            createdAt: data.created_at,
            productId: data.product_id
        };
    }
}