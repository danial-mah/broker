import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('assets')
  listAssets(@Query('q') query?: string) {
    return this.marketService.listAssets(query);
  }

  @Get('crypto')
  listCryptoMarkets() {
    return this.marketService.listCryptoMarkets();
  }

  @Get('crypto/:id')
  getCryptoMarket(@Param('id') id: string) {
    return this.marketService.getCryptoMarket(id);
  }

  @Get('assets/:symbol/news')
  getAssetNews(@Param('symbol') symbol: string) {
    return this.marketService.getAssetNews(symbol);
  }

  @Get('assets/:symbol')
  getAsset(@Param('symbol') symbol: string) {
    return this.marketService.getAsset(symbol);
  }
}
