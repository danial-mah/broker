import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.watchlistService.list(user.id);
  }

  @Post(':symbol')
  add(@CurrentUser() user: AuthUser, @Param('symbol') symbol: string) {
    return this.watchlistService.add(user.id, symbol);
  }

  @Delete(':symbol')
  remove(@CurrentUser() user: AuthUser, @Param('symbol') symbol: string) {
    return this.watchlistService.remove(user.id, symbol);
  }
}
