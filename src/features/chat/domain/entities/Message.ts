export interface Message {
  id: string;
  roomId: string;
  userId: string;          // <--- Tu entidad original usa 'userId'
  content: string;
  imageUrl?: string;       // Opcional por si envía imágenes
  createdAt: Date;         // O string, dependiendo de cómo manejes las fechas
  authorUsername?: string; // Nombre del usuario que escribió el mensaje
}

export interface Room{
    id: string;
    name: string;
    createdBy: string;
    createAt: Date;
}