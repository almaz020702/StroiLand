import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class FilterQueryDto {
	@IsString()
	@IsOptional()
	category: string;

	@IsNumber()
	@Transform(({ value }) => parseInt(value, 10))
	@IsOptional()
	priceMin: number;

	@IsNumber()
	@Transform(({ value }) => parseInt(value, 10))
	@IsOptional()
	priceMax: number;
}
