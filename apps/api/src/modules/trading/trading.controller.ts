import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { TradingService } from './trading.service';

@ApiTags('trading')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Post('orders')
  createOrder(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.tradingService.createOrder(user.id, dto);
  }

  @Get('orders')
  orderHistory(@CurrentUser() user: AuthUser) {
    return this.tradingService.orderHistory(user.id);
  }

  @Get('portfolio')
  portfolio(@CurrentUser() user: AuthUser) {
    return this.tradingService.portfolio(user.id);
  }
}
