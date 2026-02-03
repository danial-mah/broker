import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketGateway } from './market.gateway';
import { MarketService } from './market.service';

@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketGateway],
  exports: [MarketService, MarketGateway]
})
export class MarketModule {}
