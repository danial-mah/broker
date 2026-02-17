import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class WalletTransactionDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({ example: 'Paper trading funding', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
