import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'notifications',
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true }
})
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  emitToUser(userId: string, payload: unknown) {
    this.server.emit(`notification:${userId}`, payload);
  }
}
