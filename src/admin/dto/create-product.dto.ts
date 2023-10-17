import { IsString, IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => parseFloat(value))
  price: number;

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => parseInt(value))
  stock_quantity: number;

  @IsNumber()
  @IsPositive()
  @Transform(({value}) => parseInt(value))
  category_id: number;
}
