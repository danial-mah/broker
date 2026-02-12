import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';

@Module({
  imports: [NotificationsModule],
  controllers: [TradingController],
  providers: [TradingService]
})
export class TradingModule {}
