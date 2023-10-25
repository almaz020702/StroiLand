import { IsArray, IsInt, Min, ArrayMinSize } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  productIds: number[];

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  quantities: number[];
}
