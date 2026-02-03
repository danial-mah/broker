import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MarketService } from './market.service';

@WebSocketGateway({
  namespace: 'market',
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true }
})
export class MarketGateway implements OnModuleInit {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly marketService: MarketService) {}

  onModuleInit() {
    setInterval(async () => {
      const tick = await this.marketService.randomTick();
      if (tick) {
        this.server.emit('market:tick', tick);
      }
    }, 2500);
  }
}
