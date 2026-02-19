import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  summary(@CurrentUser() user: AuthUser) {
    return this.walletService.summary(user.id);
  }

  @Post('deposit')
  deposit(@CurrentUser() user: AuthUser, @Body() dto: WalletTransactionDto) {
    return this.walletService.deposit(user.id, dto);
  }

  @Post('withdraw')
  withdraw(@CurrentUser() user: AuthUser, @Body() dto: WalletTransactionDto) {
    return this.walletService.withdraw(user.id, dto);
  }
}
