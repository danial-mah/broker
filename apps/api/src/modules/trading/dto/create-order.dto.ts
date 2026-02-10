import { ApiProperty } from '@nestjs/swagger';
import { OrderSide } from '@prisma/client';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'AAPL' })
  @IsString()
  symbol!: string;

  @ApiProperty({ enum: OrderSide, example: OrderSide.BUY })
  @IsEnum(OrderSide)
  side!: OrderSide;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0.00000001)
  quantity!: number;
}
