import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Transform(({ value }) => parseFloat(value))
	price?: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Transform(({ value }) => parseInt(value))
	stock_quantity?: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Transform(({ value }) => parseInt(value))
	category_id?: number;
}
